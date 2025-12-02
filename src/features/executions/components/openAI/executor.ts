import type {NodeExecutor, WorkflowContext} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import ky, {type Options} from "ky"
import Handlebars from "handlebars"
import {generateText} from "ai";
import {openAiChannel} from "@/inngest/channels/openai";
import {createOpenAI} from "@ai-sdk/openai";
import prisma from "@/lib/db";

interface OpenAiData {
  variableName?: string
  credentialId?: string
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
                                                                 publish, userId
                                                               }) => {


  await publish(openAiChannel().status({
    nodeId,
    status: "loading"
  }))
  console.log('[openAiChannel] Loading status published for node:', nodeId)

  if (!data.credentialId) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("OpenAi Node: Missing credentialId")
  }


  if (!data.variableName) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("OpenAi Node: Variable name is missing")
  }

  if (!data.userPrompt) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("OpenAi Node: User prompt is missing")
  }

  // TODO: Throw error if credentials are missing

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant."
  const credential = await step.run("get-credentials", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId
      }
    })
  })

  if (!credential) {
    await publish(openAiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("OpenAi Node: Missing credentialId")
  }

  const userPrompt = Handlebars.compile(data.userPrompt)(context)

  //  Hard-coded credentials
  // const credentialValue = process.env.OPENAI_API_KEY!
  // TODO: Fetch credential that use selected
  const openAi = createOpenAI({
    apiKey: credential.value,
  })

  try {

    const {steps} = await step.ai.wrap("openai-generate-text", generateText, {
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