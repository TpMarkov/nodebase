import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { googleFormChannel } from "@/inngest/channels/google-form-channel";

type GoogleFormTriggerData = Record<string, unknown>

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
  publish, nodeId, step, context
}) => {
  console.log('[googleFormTriggerExecutor] Publishing loading status for node:', nodeId)
  await publish(
    googleFormChannel().status({
      nodeId,
      status: "loading"
    })
  )
  console.log('[googleFormTriggerExecutor] Loading status published for node:', nodeId)

  const result = await step.run("google-form-trigger", async () => {
    return context
  })

  console.log('[googleFormTriggerExecutor] Publishing success status for node:', nodeId)
  await publish(
    googleFormChannel().status({
      nodeId,
      status: "success"
    })
  )
  console.log('[googleFormTriggerExecutor] Success status published for node:', nodeId)

  return result
}