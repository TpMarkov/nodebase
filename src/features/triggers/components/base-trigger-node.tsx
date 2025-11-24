"use client"
import React, {memo} from 'react'

import {type NodeProps, Position, useReactFlow} from "@xyflow/react"

import type {LucideIcon} from "lucide-react";

import Image from "next/image"

import {BaseNode, BaseNodeContent, BaseNodeHeaderTitle} from "@/components/react-flow/base-node";

import {BaseHandle} from "@/components/react-flow/base-handle";

import {WorkflowNode} from "@/components/workflow-node";
import {NodeStatusIndicator} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string
  name: string
  id: string,
  description?: string
  children?: React.ReactNode
  status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseTriggerNode = memo(({
                                       children,
                                       id,
                                       icon: Icon,
                                       onDoubleClick,
                                       onSettings,
                                       name,
                                       status = initial,
                                       description
                                     }:
                                     BaseTriggerNodeProps
    ) => {

      const {setEdges, setNodes} = useReactFlow()
      // Add delete method
      const handleDelete = () => {
        setNodes((currentNodes) => {
          const updatedNodes = currentNodes.filter((node) => node.id !== id)
          return updatedNodes
        })

        setEdges((currentEdges) => {
          const updatedEdges = currentEdges.filter((edge) => edge.source && edge.target !== id)
          return updatedEdges
        })
      }


      return (
          // Wrap this within a NodeStatus indicator
          <NodeStatusIndicator
              variant={"border"}
              status={status}
              className={"rounded-l-2xl"}
          >

            <WorkflowNode name={name}
                          onSettings={onSettings}
                          description={description}
                          onDelete={handleDelete}
            >
              <BaseNode onDoubleClick={onDoubleClick}
                        className={"rounded-l-2xl relative group"}
                        status={status}
              >
                <BaseNodeContent>
                  {typeof Icon === "string" ? (<Image src={Icon}
                                                      alt={name}
                                                      width={16}
                                                      height={16}/>) : (
                      <Icon className={"size-4 text-muted-foreground"}/>)}
                  {children}
                  <BaseHandle id={"source-1"} type={"source"} position={Position.Right}/>

                </BaseNodeContent>
              </BaseNode>
            </WorkflowNode>
          </NodeStatusIndicator>

      )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"





