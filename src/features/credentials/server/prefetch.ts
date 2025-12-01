import type {inferInput} from "@trpc/tanstack-react-query";
import {prefetch, trpc} from "@/trpc/server";

/**
 * inferInput is type referring to the .input prop used in trpc procedures
 */

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetch all credentials
 */
export const prefetchCredentials = (params: Input) => {

    return prefetch(trpc.credentials.getMany.queryOptions(params))
}

/**
 * Hook that prefetches a single credential
 */

export const prefetchCredential = (id: string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({id}))
}