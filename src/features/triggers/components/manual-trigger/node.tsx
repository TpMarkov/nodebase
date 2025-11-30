import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {MousePointerIcon} from "lucide-react";
import {ManualTriggerDialog} from "@/features/triggers/components/manual-trigger/dialog";
import {useNodeStatus} from "@/features/executions/hooks/use-node-status";
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenSettings = () => {
    setDialogOpen(true)
  }
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: manualTriggerChannel().name,
    topic: "status",
    refreshToken: async () => {
      const response = await fetch('/api/realtime/manual-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch realtime token')
      }
      return response.json()
    }
  })
  return (
      <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode
            {...props}
            name={"Manual Trigger"}
            icon={MousePointerIcon}
            onSettings={handleOpenSettings}
            status={nodeStatus}
            onDoubleClick={handleOpenSettings}
        />
      </>
  )
})

ManualTriggerNode.displayName = "ManualTriggerNode"