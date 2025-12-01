import React, {Suspense} from 'react'
import {requireAuth} from "@/lib/auth-utils";
import {SearchParams} from "nuqs";
import {credentialParamsLoader} from "@/features/credentials/server/params-loader";
import {prefetchCredentials} from "@/features/credentials/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorBoundary} from "react-error-boundary"
import CredentialsList, {
  CredentialEmpty,
  CredentialLoading,
  CredentialsContainer
} from "@/features/credentials/components/credentials";

type Props = {
  searchParams: Promise<SearchParams>
}

const Page = async ({searchParams}: Props) => {
  await requireAuth()

  const params = await credentialParamsLoader(searchParams)
  prefetchCredentials(params)

  return (
      <CredentialsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialEmpty/>}>
            <Suspense fallback={<CredentialLoading/>}>
              <CredentialsList/>
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </CredentialsContainer>
  )
}
export default Page
