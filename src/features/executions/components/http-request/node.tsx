"use client"

import {Node, NodeProps, useReactFlow} from "@xyflow/react";

import {GlobeIcon} from "lucide-react";

import {memo, useState} from "react";

import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {HttpRequestFormValues, HttpRequestDialog} from "@/features/executions/components/http-request/dialog";
import {z} from "zod"

type HttpRequestNodeData = {
  endpoint?: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: string
  [key: string]: unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {setNodes} = useReactFlow()

  const nodeStatus = "success"

  const nodeData = props.data
  const description = nodeData?.endpoint ? `${nodeData.method || "GET"}:\n ${nodeData.endpoint}` : "Not Configured"

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: HttpRequestFormValues) => {

    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node, data: {
            ...node.data,
            endpoint: values.endpoint,
            method: values.method,
            body: values.body
          }
        }
      }
      return node
    }))
  }

  return (
      <>
        <HttpRequestDialog open={dialogOpen} onOpenChange={setDialogOpen}
                           onSubmit={handleSubmit}
                           defaultValues={nodeData}
        />
        <BaseExecutionNode
            {...props}
            id={props.id}
            icon={GlobeIcon}
            name={"HTTP Request"}
            status={nodeStatus}
            onDoubleClick={handleDialogOpen}
            onSettings={handleDialogOpen}
            description={description}
        />
      </>
  )
})

HttpRequestNode.displayName = "HttpRequestNode"