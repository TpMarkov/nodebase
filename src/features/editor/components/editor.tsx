"use client"
import React from 'react'
import {useSuspenseWorkflow, useUpdateWorkflowName} from "@/features/workflows/hooks/use-workflows";
import {ErrorView, LoadingView} from "@/components/entity-components";
import {Breadcrumb, BreadcrumbItem} from "@/components/ui/breadcrumb";


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


  return (
      <div className={"flex items-center flex-col gap-y-4"}>
        {JSON.stringify(workflow, null, 2)}
      </div>
  )
}
