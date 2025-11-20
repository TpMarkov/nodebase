import React from 'react'
import {requireAuth} from "@/lib/auth-utils";

const Page = async () => {
  requireAuth()
  return (
      <div>Workflows page</div>
  )
}
export default Page
