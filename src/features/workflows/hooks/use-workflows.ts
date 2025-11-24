/**
 * Hook to fetch all workflows using suspense
 */
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {useWorkflowsParams} from "@/features/workflows/hooks/use-workflows-params";

export const useSuspenseWorkflows = () => {

  const trpc = useTRPC()

  const [params] = useWorkflowsParams()

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

/**
 * Hook to create new workflow
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.workflows.createWorkflow.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow ${data.name} created successfully.`)
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}


/**
 * Hook to remove workflow
 */

export const useRemoveWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.workflows.remove.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow ${data.name} removed successfully.`)
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
      queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({
        id: data.id
      }))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))

}


/**
 * A hook to fetch a single workflow from a client component
 */

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}


/**
 * Hook to edit the name of the workflow
 */

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.workflows.updateName.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow ${data.name} updated successfully.`)
      queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id: data.id}))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}

/**
 * Hook that updates and saves the workflow
 */
export const useUpdateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.workflows.update.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow ${data.name} saved successfully.`)
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
      queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id: data.id}))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}