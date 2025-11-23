"use client"
import React, {memo} from 'react'

import {type NodeProps, Position} from "@xyflow/react"

import type {LucideIcon} from "lucide-react";

import Image from "next/image"

import {BaseNode, BaseNodeContent, BaseNodeHeaderTitle} from "@/components/react-flow/base-node";

import {BaseHandle} from "@/components/react-flow/base-handle";

import {WorkflowNode} from "@/components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string
  name: string
  description?: string
  children?: React.ReactNode
  // status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseExecutionNode = memo(({
                                         children,
                                         icon: Icon,
                                         onDoubleClick,
                                         onSettings,
                                         name,
                                         description
                                       }:
                                       BaseExecutionNodeProps
    ) => {
      // Add delete method
      const handleDelete = () => {
      }
      return (
          // Wrap this within a NodeStatus indicator
          <WorkflowNode name={name}
                        onSettings={onSettings}
                        description={description}
                        onDelete={handleDelete}
          >
            <BaseNode onDoubleClick={onDoubleClick}>
              <BaseNodeContent>
                {typeof Icon === "string" ? (<Image src={Icon}
                                                    alt={name}
                                                    width={16}
                                                    height={16}/>) : (
                    <Icon className={"size-4 text-muted-foreground"}/>)}
                {children}
                <BaseHandle id={"target-1"} type={"target"} position={Position.Left}/>
                <BaseHandle id={"source-1"} type={"source"} position={Position.Right}/>

              </BaseNodeContent>
            </BaseNode>
          </WorkflowNode>
      )
    }
)

BaseExecutionNode.displayName = "BaseExecutionNode"





