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