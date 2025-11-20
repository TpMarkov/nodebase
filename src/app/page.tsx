"use client"
import {requireAuth} from "@/lib/auth-utils";
import {LogoutButton} from "@/app/logoutButton";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";

const Page = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const {data} = useQuery(trpc.getWorkflows.queryOptions())


  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: (data) => console.log(data),
    onError: (err) => console.error("AI error:", err)
  }))


  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }))


  return <div className="min-h-screen w-full flex items-center flex-col gap-6 justify-center">
    {JSON.stringify(data, null, 2)}
    <Button onClick={() => create.mutate()}>
      Create workflow
    </Button>
    <Button
        disabled={testAi.isPending}
        onClick={() => testAi.mutate()}>
      Test Ai
    </Button>
    <LogoutButton/>
  </div>
}

export default Page