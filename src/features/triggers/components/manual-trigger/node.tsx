import {memo} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {MousePointerIcon} from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {

  return (
      <>
        <BaseTriggerNode
            {...props}
            name={"Manual Trigger"}
            icon={MousePointerIcon}
            // onSettings={() => {
            // }}
            // status={nodeStatus}
            // onDelete={handleDelete}
            // onDoubleClick={handleOpenSettings}
        />
      </>
  )
})

ManualTriggerNode.displayName = "ManualTriggerNode"