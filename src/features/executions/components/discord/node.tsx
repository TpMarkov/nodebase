"use client"

import {Node, NodeProps, useReactFlow} from "@xyflow/react";


import {memo, useState} from "react";

import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-status";
import {geminiChannel} from "@/inngest/channels/gemini";
import {DiscordDialog, DiscordFormValues} from "@/features/executions/components/discord/dialog";
import {discordChannel} from "@/inngest/channels/discord";

type DiscordNodeData = {
  webhookUrl?: string
  content?: string
  username?: string
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {setNodes} = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: discordChannel().name,
    topic: "status",
    refreshToken: async () => {
      const response = await fetch('/api/realtime/discord', {
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
  const description = nodeData?.content ? `Send ${nodeData.content.slice(0, 50)}...` : "Not Configured"

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: DiscordFormValues) => {

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
        <DiscordDialog open={dialogOpen} onOpenChange={setDialogOpen}
                       onSubmit={handleSubmit}
                       defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={"/logos/discord.svg"}
            name={"Discord"}
            status={nodeStatus}
            onDoubleClick={handleDialogOpen}
            onSettings={handleDialogOpen}
            description={description}
        />
      </>
  )
})

DiscordNode.displayName = "DiscordNode"