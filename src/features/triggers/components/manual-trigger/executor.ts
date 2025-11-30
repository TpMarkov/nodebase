import type {NodeExecutor} from "@/features/executions/types";
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
                                                                               nodeId, step, context, publish
                                                                             }) => {
  // TODO : Publish "loading" state for manual trigger

  const result = await step.run("manual-trigger", async () => {
    await publish(manualTriggerChannel().status({
      nodeId,
      status: "loading"
    }))
    return context
  })

  // TODO: Publish "success" state for manual trigger
  await publish(manualTriggerChannel().status({
    nodeId,
    status: "success"
  }))
  return result
}