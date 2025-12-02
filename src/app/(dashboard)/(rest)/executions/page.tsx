import React, { Suspense } from "react";
import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);

  prefetchExecutions(params);

  return (
    <>
      <HydrateClient>
        <ErrorBoundary fallback={<></>}>
          <Suspense fallback={<></>}>TODO: List for executions</Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </>
  );
};
export default Page;
