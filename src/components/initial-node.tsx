import React, {useState} from 'react'
import {memo} from 'react'
import type {NodeProps} from "@xyflow/react"
import {PlaceholderNode} from "@/components/react-flow/placeholder-node";
import {PlusIcon} from "lucide-react";
import {WorkflowNode} from "@/components/workflow-node";
import {NodeSelector} from "@/components/node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  return (
      <NodeSelector open={open} onOpenChange={setOpen}>
        <WorkflowNode showToolbar name={"Initial-Node"}
                      description={"Click to edit or run this workflow"}
        >
          <PlaceholderNode {...props} onClick={() => {
            setOpen(true);
          }}>
            <div className={"cursor-pointer flex items-center justify-center"}>
              <PlusIcon className={"size-4"}/>
            </div>
          </PlaceholderNode>
        </WorkflowNode>
      </NodeSelector>
  )
})

InitialNode.displayName = 'InitialNode'
