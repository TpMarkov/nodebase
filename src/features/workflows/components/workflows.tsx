"use client"
import React from 'react'
import {useCreateWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {EntityContainer, EntityHeader} from "@/components/entity-components";
import {useUpgradeModal} from "@/hooks/use-modal";
import {useRouter} from "next/navigation";

const WorkflowsList = () => {
  const {data: workflows} = useSuspenseWorkflows()

  return (
      <div className={"flex flex-1 items-center justify-center"}>
        <p>
          {JSON.stringify(workflows, null, 2)}
        </p>
      </div>
  )
}
export default WorkflowsList


export const WorkflowsHeader = ({disabled}: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const {modal, handleError} = useUpgradeModal()
  const router = useRouter()

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      },
      onError: (error) =>
          //TODO: Open upgrade panel
          handleError(error)
    })
  }

  return <>
    {modal}
    <EntityHeader title={"Workflows"}
                  onNew={handleCreateWorkflow}
                  newButtonLabel={"New workflow"}
                  isCreating={false}
                  disabled={createWorkflow.isPending}
                  description={"Create and manage your workflows"}
    />
  </>
}

export const WorkflowsContainer = ({children}: { children: React.ReactNode }) => {
  return (
      <EntityContainer header={<WorkflowsHeader/>}
                       search={<></>}
                       pagination={<></>}
      >
        {children}
      </EntityContainer>
  )
}