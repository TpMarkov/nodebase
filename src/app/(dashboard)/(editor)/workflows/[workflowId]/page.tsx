import React, { Suspense } from 'react'
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
  params: {
    workflowId: string
  }
}

const Page = async ({ params }: PageProps) => {
  await requireAuth()
  const { workflowId } = await params
  prefetchWorkflow(workflowId)

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <main className="flex flex-col h-screen overflow-hidden">
            <EditorHeader workflowId={workflowId} />

            {/* Editor takes the remaining space ONLY */}
            <div className="flex-1 h-[calc(100vh-56px)] overflow-hidden">
              <Editor workflowId={workflowId} />
            </div>
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
export default Page
