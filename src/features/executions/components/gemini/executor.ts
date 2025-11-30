import type { NodeExecutor, WorkflowContext } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky"
import Handlebars from "handlebars"
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { AVAILABLE_MODELS } from "@/features/executions/components/gemini/dialog";

interface GeminiData {
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

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data, nodeId, step, context,
  publish
}) => {


  await publish(geminiChannel().status({
    nodeId,
    status: "loading"
  }))
  console.log('[geminiChannel] Loading status published for node:', nodeId)

  if (!data.variableName) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Gemini Node: Variable name is missing")
  }

  if (!data.userPrompt) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Gemini Node: User prompt is missing")
  }

  // TODO: Throw error if credentials are missing

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant."

  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!
  // TODO: Fetch credential that use selected
  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
  })

  try {

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-2.0-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    })

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : ""

    await publish(geminiChannel().status({
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
    await publish(geminiChannel().status({
      nodeId,
      status: "error"
    }))
    throw error
  }

}