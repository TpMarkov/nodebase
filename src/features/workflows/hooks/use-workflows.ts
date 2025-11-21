/**
 * Hook to fetch all workflows using suspense
 */
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import prisma from "@/lib/db";
import {toast} from "sonner";

export const useSuspenseWorkflows = () => {

  const trpc = useTRPC()
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
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
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions())
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}