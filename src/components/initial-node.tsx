import React from 'react'
import {useState, memo} from 'react'
import type {NodeProps} from "@xyflow/react"
import {PlaceholderNode} from "@/components/react-flow/placeholder-node";
import {PlusIcon} from "lucide-react";
import {WorkflowNode} from "@/components/workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
      <WorkflowNode showToolbar name={"Initial-Node"}
                    description={"Click to edit or run this workflow"}
      >
        <PlaceholderNode {...props} onClick={() => {
        }}>
          <div className={"cursor-pointer flex items-center justify-center"}>
            <PlusIcon className={"size-4"}/>
          </div>
        </PlaceholderNode>
      </WorkflowNode>
  )
})

InitialNode.displayName = 'InitialNode'
