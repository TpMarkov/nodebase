import React, {Suspense} from 'react'
import {requireAuth} from "@/lib/auth-utils";
import {prefetchWorkflow} from "@/features/workflows/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorBoundary} from "react-error-boundary";
import {Editor, EditorError, EditorLoading} from "@/features/editor/components/editor";
import {EditorHeader} from "@/features/editor/components/editor-header";

interface PageProps {
  params: {
    workflowId: string
  }
}

const Page = async ({params}: PageProps) => {
  const {workflowId} = await params
  prefetchWorkflow(workflowId)

  requireAuth()
  return (
      <HydrateClient>
        <ErrorBoundary fallback={<EditorError/>}>
          <Suspense fallback={<EditorLoading/>}>
            <main className={"flex-1"}>
              <EditorHeader workflowId={workflowId}/>
              <Editor workflowId={workflowId}/>
            </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
  )
}
export default Page
