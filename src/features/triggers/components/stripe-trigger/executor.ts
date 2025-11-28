import type { NodeExecutor } from "@/features/executions/types";
import { stripeChannel } from "@/inngest/channels/stripe-channel";

type StripeTriggerData = Record<string, unknown>

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  publish, nodeId, step, context
}) => {
  console.log('[stripeTriggerExecutor] Publishing loading status for node:', nodeId)
  await publish(
    stripeChannel().status({
      nodeId,
      status: "loading"
    })
  )
  console.log('[stripeTriggerExecutor] Loading status published for node:', nodeId)

  const result = await step.run("stripe-trigger", async () => {
    return context
  })

  console.log('[stripeTriggerExecutor] Publishing success status for node:', nodeId)
  await publish(
    stripeChannel().status({
      nodeId,
      status: "success"
    })
  )
  console.log('[stripeTriggerExecutor] Success status published for node:', nodeId)

  return result
}