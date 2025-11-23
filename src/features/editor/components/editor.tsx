"use client"
import React from 'react'
import {useSuspenseWorkflow, useUpdateWorkflowName} from "@/features/workflows/hooks/use-workflows";
import {ErrorView, LoadingView} from "@/components/entity-components";
import {BreadcrumbItem} from "@/components/ui/breadcrumb";
import {useState, useCallback} from "react";
import {
  type Node,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  addEdge,
  NodeChange,
  EdgeChange, type Connection, ReactFlow, Background, Controls, MiniMap, Panel
} from "@xyflow/react"
import '@xyflow/react/dist/style.css';
import {nodeComponents} from "@/config/node-components";
import {AddNodeButton} from "@/features/editor/components/add-node-button";

export const EditorLoading = () => {
  return (
      <LoadingView message={"Loading editor"}/>
  )
}

export const EditorError = () => {
  return (
      <ErrorView message={"Error loading Editor"}/>
  )
}


export const EditorName = ({workflowId}: { workflowId: string }) => {
  const {data: workflow} = useSuspenseWorkflow(workflowId)
  const updateWorkflowName = useUpdateWorkflowName()

  return (
      <BreadcrumbItem>
        {workflow.name}
      </BreadcrumbItem>
  )
}


export const Editor = ({workflowId}: { workflowId: string }) => {

  const {data: workflow} = useSuspenseWorkflow(workflowId)

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
      (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
  );
  const onEdgesChange = useCallback(
      (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
  );
  const onConnect = useCallback(
      (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
      [],
  );
  return (
      <div className={"size-full"}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeComponents}
            proOptions={{
              hideAttribution: true
            }}
        >
          <Background/>
          <Controls/>
          <MiniMap/>
          <Panel position={"top-right"}>
            <AddNodeButton/>
          </Panel>
        </ReactFlow>
      </div>
  )
}
