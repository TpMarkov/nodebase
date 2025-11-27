import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { GoogleFormDialog } from "@/features/triggers/components/google-form-trigger/dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { googleFormChannel } from "@/inngest/channels/google-form-channel";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenSettings = () => {
    setDialogOpen(true)
  }
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "google-form-execution",
    topic: "status",
    refreshToken: async () => {
      console.log("[GoogleFormTrigger] Fetching realtime token from API...")
      try {
        const response = await fetch('/api/realtime/google-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch realtime token')
        }

        const token = await response.json()
        console.log("[GoogleFormTrigger] Fetched token:", token)
        return token
      } catch (error) {
        console.error("[GoogleFormTrigger] Failed to fetch token:", error)
        throw error
      }
    }
  })
  return (
    <>
      <GoogleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        name={"Google Form"}
        icon={"/logos/googleform.svg"}
        onSettings={handleOpenSettings}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

GoogleFormTrigger.displayName = "GoogleFormTrigger"