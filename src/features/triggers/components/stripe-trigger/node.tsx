import { memo, useState } from "react";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { NodeProps } from "@xyflow/react";
import { StripeTriggerDialog } from "@/features/triggers/components/stripe-trigger/dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenSettings = () => {
    setDialogOpen(true)
  }
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "stripe-execution",
    topic: "status",
    refreshToken: async () => {
      console.log("[StripeTrigger] Fetching realtime token from API...")
      try {
        const response = await fetch('/api/realtime/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch realtime token')
        }

        const token = await response.json()
        console.log("[StripeTrigger] Fetched token:", token)
        return token
      } catch (error) {
        console.error("[StripeTrigger] Failed to fetch token:", error)
        throw error
      }
    }
  })
  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        name={"Stripe"}
        icon={"/logos/stripe.svg"}
        description={"When stripe event is captured"}
        onSettings={handleOpenSettings}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

StripeTriggerNode.displayName = "StripeTriggerNode"