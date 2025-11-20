import React from 'react'
import {requireAuth} from "@/lib/auth-utils";

interface PageProps {
  params: {
    workflowId: string
  }
}

const Page = async ({params}: PageProps) => {
  const {workflowId} = await params
  requireAuth()
  return (
      <div>Workflow ID: {workflowId}</div>
  )
}
export default Page
