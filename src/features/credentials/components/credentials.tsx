"use client"
import React from 'react'
import {
  useCreateCredential,
  useCredentialsByType,
  useRemoveCredential,
  useSuspenseCredential,
  useSuspenseCredentials,
  useUpdateCredential
} from "@/features/credentials/hooks/use-credentials";
import {
  EmptyView,
  EntityContainer,
  EntityHeader, EntityItem, EntityList,
  EntityPagination,
  EntitySearch, ErrorView,
  LoadingView
} from "@/components/entity-components";

import {useRouter} from "next/navigation";
import {useCredentialsParams} from "@/features/credentials/hooks/use-credentials-params";
import {useEntitySearch} from "@/hooks/use-entity-search";
import {formatDistanceToNow} from "date-fns";

import type {Credential} from "@/generated/prisma/browser";
import {CredentialType} from "@/generated/prisma/enums";

import Image from "next/image";


const CredentialsList = () => {
  const credentials = useSuspenseCredentials()


  return (
      <EntityList items={credentials.data.items}
                  getKey={(credential) => credential.id}
                  emptyView={<CredentialEmpty/>}
                  renderItem={(credential) => <CredentialItem data={credential}/>}
      />
  )
}
export default CredentialsList


export const CredentialsHeader = (
    {
      disabled
    }
    :
    {
      disabled?: boolean
    }
) => {

  return <>
    <EntityHeader
        title={"Credentials"}
        newButtonLabel={"New credential"}
        newButtonHref={"/credentials/new"}
        description={"Create and manage your credentials"}
        disabled={disabled}
    />
  </>
}

export const CredentialsContainer = ({children}: { children: React.ReactNode }) => {
  return (
      <EntityContainer header={<CredentialsHeader/>}
                       search={<CredentialsSearch/>}
                       pagination={<CredentialsPagination/>}
      >
        {children}
      </EntityContainer>
  )
}


export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams()
  const {searchValue, onSearchChange} = useEntitySearch({
    params, setParams
  })


  return (
      <EntitySearch onChange={onSearchChange} value={searchValue} placeholder={"Search credentials"}
      />
  )
}


export const CredentialsPagination = () => {
  const workflows = useSuspenseCredentials()
  const [params, setParams] = useCredentialsParams()


  return (
      <EntityPagination
          disabled={workflows.isFetching}
          page={workflows.data.page} totalPages={workflows.data.totalPages} onPageChange={(page) => {
        setParams({...params, page})
      }}/>
  )
}


export const CredentialLoading = () => {
  return (
      <LoadingView message={"Loading credentials..."}/>
  )
}


export const CredentialError = () => {
  return (
      <ErrorView message={"Error loading credentials"}/>
  )
}

export const CredentialEmpty = () => {
  const router = useRouter()

  const handleCreate = () => {
    router.push("/credentials/new")
  }
  return (
      <EmptyView
          message={"You haven't created any credentials yet. Get started by creating your first credential."}
          onNew={handleCreate}
      />
  )
}

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
}


export const CredentialItem = ({data}: { data: Credential }) => {

  const removeCredential = useRemoveCredential()
  const handleRemove = () => {
    return removeCredential.mutate({
      id: data.id
    })
  }

  const logo = credentialLogos[data.type] || "/logos/openai.svg"

  return (
      <EntityItem href={`/credentials/${data.id}`} title={data.name}
                  subtitle={<>
                    Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})}
                    &bull;{" "}
                    Created{" "} {formatDistanceToNow(data.createdAt, {addSuffix: true})}
                  </>}
                  image={
                    <div className={"size-8 flex items-center justify-center"}>
                      <Image src={logo} alt={data.type} width={20} height={20}/>
                    </div>
                  }
                  onRemove={handleRemove}
                  isRemoving={removeCredential.isPending}
      />
  )
}
