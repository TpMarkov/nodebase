import {inngest} from "./client";
import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai"
import {createOpenAI} from "@ai-sdk/openai";

const google = createGoogleGenerativeAI();
const openAi = createOpenAI()

export const execute = inngest.createFunction(
    {id: "execute-ai"},
    {event: "execute/ai"},
    async ({event, step}) => {

      const {steps} = await step.ai.wrap("gemini-generate-text", generateText, {
        system: "You are a helpful assistant",
        model: google("gemini-2.5-flash"),
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        }
      })
      return steps
    }
);


