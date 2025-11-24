"use client"
import React, {memo} from 'react'

import {type NodeProps, Position, useReactFlow} from "@xyflow/react"

import type {LucideIcon} from "lucide-react";

import Image from "next/image"

import {BaseNode, BaseNodeContent} from "@/components/react-flow/base-node";

import {BaseHandle} from "@/components/react-flow/base-handle";

import {WorkflowNode} from "@/components/workflow-node";
import {NodeStatus, NodeStatusIndicator} from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string
  name: string
  description?: string
  children?: React.ReactNode
  id: string
  status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseExecutionNode = memo(({
                                         children,
                                         icon: Icon,
                                         id,
                                         onDoubleClick,
                                         status = "initial",
                                         onSettings,
                                         name,
                                         description
                                       }:
                                       BaseExecutionNodeProps
    ) => {
      // Add delete method
      const {setEdges, setNodes} = useReactFlow()
      // Add delete method
      const handleDelete = () => {
        setNodes((currentNodes) => {
          return currentNodes.filter((node) => node.id !== id)
        })

        setEdges((currentEdges) => {
          return currentEdges.filter((edge) => edge.source !== id && edge.target !== id)
        })
      }
      return (
          // Wrap this within a NodeStatus indicator
          <NodeStatusIndicator
              variant={"border"}
              status={status}
          >
            <WorkflowNode name={name}
                          onSettings={onSettings}
                          description={description}
                          onDelete={handleDelete}
            >
              <BaseNode onDoubleClick={onDoubleClick}
                        status={status}
              >
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
          </NodeStatusIndicator>
      )
    }
)

BaseExecutionNode.displayName = "BaseExecutionNode"





