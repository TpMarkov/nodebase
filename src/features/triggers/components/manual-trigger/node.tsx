import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {MousePointerIcon} from "lucide-react";
import {ManualTriggerDialog} from "@/features/triggers/components/manual-trigger/dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenSettings = () => {
    setDialogOpen(true)
  }
  const nodeStatus = "loading"
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