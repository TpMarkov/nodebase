"use client"
import React from 'react'
import {useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {
  EmptyView,
  EntityContainer,
  EntityHeader, EntityItem, EntityList,
  EntityPagination,
  EntitySearch, ErrorView,
  LoadingView
} from "@/components/entity-components";
import {useUpgradeModal} from "@/hooks/use-modal";
import {useRouter} from "next/navigation";
import {useWorkflowsParams} from "@/features/workflows/hooks/use-workflows-params";
import {useEntitySearch} from "@/hooks/use-entity-search";
import type {Workflow} from "@/generated/prisma/client";
import {WorkflowIcon} from "lucide-react";
import {formatDistanceToNow} from "date-fns";

const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows()


  return (
      <EntityList items={workflows.data.items}
                  getKey={(workflow) => workflow.id}
                  emptyView={<WorkflowsEmptyView/>}
                  renderItem={(workflow) => <WorkflowItem data={workflow}/>}
      />
  )
}
export default WorkflowsList


export const WorkflowsHeader = (
    {
      disabled
    }
    :
    {
      disabled?: boolean
    }
) => {
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
                       search={<WorkflowsSearch></WorkflowsSearch>}
                       pagination={<WorkflowsPagination/>}
      >
        {children}
      </EntityContainer>
  )
}


export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams()
  const {searchValue, onSearchChange} = useEntitySearch({
    params, setParams
  })


  return (
      <EntitySearch onChange={onSearchChange} value={searchValue} placeholder={"Search workflows"}
      />
  )
}


export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows()
  const [params, setParams] = useWorkflowsParams()


  return (
      <EntityPagination
          disabled={workflows.isFetching}
          page={workflows.data.page} totalPages={workflows.data.totalPages} onPageChange={(page) => {
        setParams({...params, page})
      }}/>
  )
}


export const WorkflowsLoadingView = () => {
  return (
      <LoadingView message={"Loading workflows"}/>
  )
}


export const WorkflowsErrorView = () => {
  return (
      <ErrorView message={"Error loading workflows"}/>
  )
}

export const WorkflowsEmptyView = () => {
  const createWorkflow = useCreateWorkflow()
  const {handleError, modal} = useUpgradeModal()
  const router = useRouter()
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error)
      }, onSuccess: (workflow) => {
        router.push(`/workflows/${workflow.id}}`)
      }
    })
  }
  return (
      <>
        {modal}
        <EmptyView message={"You haven't created any workflows yet. Get started by creating your first workflow."}
                   onNew={handleCreate}
        />
      </>
  )
}

export const WorkflowItem = ({data}: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow()
  const handleRemove = () => {
    return removeWorkflow.mutate({
      id: data.id
    })
  }
  return (
      <EntityItem href={`/workflows/${data.id}`} title={data.name}
                  subtitle={<>
                    Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})}
                    &bull;{" "}
                    Created{" "} {formatDistanceToNow(data.createdAt, {addSuffix: true})}
                  </>}
                  image={
                    <div className={"size-8 flex items-center justify-center"}>
                      <WorkflowIcon className={"size-5 text-muted-foreground"}/>
                    </div>
                  }
                  onRemove={handleRemove}
                  isRemoving={removeWorkflow.isPending}
      />
  )
}