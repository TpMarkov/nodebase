"use client"

import {Node, NodeProps, useReactFlow} from "@xyflow/react";

import {AVAILABLE_MODELS, GeminiFormValues} from "@/features/executions/components/gemini/dialog";

import {memo, useState} from "react";

import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-status";
import {geminiChannel} from "@/inngest/channels/gemini";
import {GeminiDialog} from "@/features/executions/components/gemini/dialog";

type GeminiNodeData = {
  variableName?: string
  model?: "gemini-1.5-flash" | "gemini-1.5-flash-8b" | "gemini-1.5-pro" | "gemini-1.0-pro" | "gemini-pro"
  systemPrompt?: string
  userPrompt?: string
}

type GeminiNodeType = Node<GeminiNodeData>

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {setNodes} = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel().name,
    topic: "status",
    refreshToken: async () => {
      const response = await fetch('/api/realtime/gemini', {
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

  const nodeData = props.data
  const description = nodeData?.userPrompt ? `${nodeData.model || AVAILABLE_MODELS[0]
  } : \n ${nodeData.userPrompt.slice(0, 50)}` : "Not Configured"

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: GeminiFormValues) => {

    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node, data: {
            ...node.data,
            ...values
          }
        }
      }
      return node
    }))
  }

  return (
      <>
        <GeminiDialog open={dialogOpen} onOpenChange={setDialogOpen}
                      onSubmit={handleSubmit}
                      defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={"/logos/gemini.svg"}
            name={"Gemini"}
            status={nodeStatus}
            onDoubleClick={handleDialogOpen}
            onSettings={handleDialogOpen}
            description={description}
        />
      </>
  )
})

GeminiNode.displayName = "GeminiNode"