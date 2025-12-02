import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

/**
 * inferInput is type referring to the .input prop used in trpc procedures
 */

type Input = inferInput<typeof trpc.executions.getMany>;

/**
 * Prefetch all credentials
 */
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getMany.queryOptions(params));
};

/**
 * Hook that prefetches a single credential
 */

export const prefetchExecution = (id: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
};
