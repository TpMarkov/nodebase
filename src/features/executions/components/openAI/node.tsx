"use client"

import {Node, NodeProps, useReactFlow} from "@xyflow/react";


import {memo, useState} from "react";

import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-status";
import {OPENAI_MODELS, OpenAiDialog, OpenAiFormValues} from "@/features/executions/components/openAI/dialog";
import {openAiChannel} from "@/inngest/channels/openai";

type OpenAiNodeData = {
  variableName?: string
  model?: "chatgpt-4o-latest" | "gpt-3.5-turbo" | "gpt-4" | undefined
  systemPrompt?: string
  userPrompt?: string
}

type OpenAiNodeType = Node<OpenAiNodeData>

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {setNodes} = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openAiChannel().name,
    topic: "status",
    refreshToken: async () => {
      const response = await fetch('/api/realtime/openai', {
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
  const description = nodeData?.userPrompt ? `${nodeData.model || OPENAI_MODELS[0]
  } : \n ${nodeData.userPrompt.slice(0, 50)}` : "Not Configured"

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: OpenAiFormValues) => {

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
        <OpenAiDialog open={dialogOpen} onOpenChange={setDialogOpen}
                      onSubmit={handleSubmit}
                      defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={"/logos/openai.svg"}
            name={"OpenAi"}
            status={nodeStatus}
            onDoubleClick={handleDialogOpen}
            onSettings={handleDialogOpen}
            description={description}
        />
      </>
  )
})

OpenAiNode.displayName = "OpenAiNode"