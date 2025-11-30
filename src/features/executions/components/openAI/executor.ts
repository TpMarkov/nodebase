import type {NodeExecutor, WorkflowContext} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import ky, {type Options} from "ky"
import Handlebars from "handlebars"
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {geminiChannel} from "@/inngest/channels/gemini";
import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai";
import {openAiChannel} from "@/inngest/channels/openai";
import {createOpenAI} from "@ai-sdk/openai";

interface OpenAiData {
  variableName?: string
  model?: string
  systemPrompt?: string
  userPrompt?: string
}

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
})

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
                                                                 data, nodeId, step, context,
                                                                 publish
                                                               }) => {


  await publish(openAiChannel().status({
    nodeId,
    status: "loading"
  }))
  console.log('[openAiChannel] Loading status published for node:', nodeId)

  if (!data.variableName) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Gemini Node: Variable name is missing")
  }

  if (!data.userPrompt) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Gemini Node: User prompt is missing")
  }

  // TODO: Throw error if credentials are missing

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant."

  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const credentialValue = process.env.OPENAI_API_KEY!
  // TODO: Fetch credential that use selected
  const openAi = createOpenAI({
    apiKey: credentialValue,
  })

  try {

    const {steps} = await step.ai.wrap("gemini-generate-text", generateText, {
      model: openAi(data.model || "gpt-4"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    })

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : ""

    await publish(openAiChannel().status({
      nodeId,
      status: "success"
    }))
    return {
      ...context,
      [data.variableName]: {
        aiResponse: text
      }
    }
  } catch (error) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw error
  }

}