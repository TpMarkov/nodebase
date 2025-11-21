import React, {Suspense} from 'react'
import {requireAuth} from "@/lib/auth-utils";
import {prefetchWorkflows} from "@/features/workflows/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorBoundary} from "react-error-boundary"
import WorkflowsList, {WorkflowsContainer} from "@/features/workflows/components/workflows";

const Page = async () => {

  requireAuth()

  prefetchWorkflows()
  return (
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<p>Error !</p>}></ErrorBoundary>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList/>
          </Suspense>
        </HydrateClient>
      </WorkflowsContainer>
  )
}
export default Page
