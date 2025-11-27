import React from 'react'
import { SignupForm } from "@/features/auth/componnets/signup-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth()

  return (
    <SignupForm />
  )
}
export default Page
