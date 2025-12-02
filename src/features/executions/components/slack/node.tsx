"use client"

import {Node, NodeProps, useReactFlow} from "@xyflow/react";


import {memo, useState} from "react";

import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-status";
import {SlackDialog, SlackFormValues} from "@/features/executions/components/slack/dialog";
import {slackChannel} from "@/inngest/channels/slack";

type SlackNodeData = {
  webhookUrl?: string
  content?: string
  username?: string
}

type SlackNodeType = Node<SlackNodeData>

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {setNodes} = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: slackChannel().name,
    topic: "status",
    refreshToken: async () => {
      const response = await fetch('/api/realtime/slack', {
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

  const handleSubmit = (values: SlackFormValues) => {

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
        <SlackDialog open={dialogOpen} onOpenChange={setDialogOpen}
                     onSubmit={handleSubmit}
                     defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={"/logos/slack.svg"}
            name={"Slack"}
            status={nodeStatus}
            onDoubleClick={handleDialogOpen}
            onSettings={handleDialogOpen}
            description={description}
        />
      </>
  )
})

SlackNode.displayName = "SlackNode"