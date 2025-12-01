import type {inferInput} from "@trpc/tanstack-react-query";
import {prefetch, trpc} from "@/trpc/server";


/**
 * inferInput is type referring to the .input prop used in trpc procedures
 */

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch all workflows
 */
export const prefetchWorkflows = (params: Input) => {

  return prefetch(trpc.workflows.getMany.queryOptions(params))
}

/**
 * Hook that prefetches a single workflow
 */

export const prefetchWorkflow = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({id}))
}