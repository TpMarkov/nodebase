/**
 * Hook to fetch all credentials using suspense
 */
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import { CredentialType } from "@prisma/client";

export const useSuspenseCredentials = () => {

  const trpc = useTRPC()

  const [params] = useCredentialsParams()

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

/**
 * Hook to create new credential
 */
export const useCreateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.credentials.create.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential ${data.name} created successfully.`)
      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}


/**
 * Hook to remove credential
 */

export const useRemoveCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.credentials.remove.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential ${data.name} removed successfully.`)
      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
      queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({
        id: data.id
      }))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}


/**
 * A hook to fetch a single credential from a client component
 */

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }))
}


/**
 * Hook that updates and saves the credential
 */
export const useUpdateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(trpc.credentials.update.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential ${data.name} saved successfully.`)
      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
      queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }))
    }, onError: (err) => {
      toast.error(err.message)
    }
  }))
}

/**
 *  Hook to fetch credentials by type
 */
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC()
  return useQuery(trpc.credentials.getByType.queryOptions({ type }))
}
