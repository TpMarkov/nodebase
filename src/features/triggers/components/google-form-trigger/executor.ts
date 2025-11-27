import type {NodeExecutor} from "@/features/executions/types";
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {googleFormChannel} from "@/inngest/channels/google-form-channel";

type GoogleFormTriggerData = Record<string, unknown>

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
                                                                                       publish, nodeId, step, context
                                                                                     }) => {
  // TODO : Publish "loading" state for manual trigger

  const result = await step.run("google-form-trigger", async () => {
    return context
  })

  await publish(
      googleFormChannel().status({
        nodeId,
        status: "success"
      })
  )

  // TODO: Publish "success" state for manual trigger

  return result
}