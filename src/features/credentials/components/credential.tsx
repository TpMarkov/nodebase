"use client"
import React from 'react'
import {CredentialType} from "@/generated/prisma/enums";
import {
  Form,
  FormMessage,
  FormDescription,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  useFormField
} from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import {useRouter, useParams} from "next/navigation";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential
} from "@/features/credentials/hooks/use-credentials";
import {useUpgradeModal} from "@/hooks/use-modal";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Select, SelectItem, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import Image from "next/image";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import Link from "next/link";

interface CredentialFormProps {
  initialData?: {
    id?: string
    name: string
    type: CredentialType
    value: string
  }
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required")
})

type FormValues = z.infer<typeof formSchema>

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/logos/openai.svg"
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg"
  }
]

export const CredentialForm = ({initialData}: CredentialFormProps) => {
  const router = useRouter()
  const createCredential = useCreateCredential()
  const updateCredential = useUpdateCredential()
  const {handleError, modal} = useUpgradeModal()

  const isEditing = !!initialData?.id

  const onSubmit = async (values: FormValues) => {
    if (isEditing && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values
      })
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`)
        },
        onError: (err) => {
          handleError(err)
        },
      })
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || CredentialType.OPENAI,
      value: initialData?.value || ""
    }
  })

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type,
        value: initialData.value
      })
    }
  }, [initialData, form])

  return (
      <>
        {modal}
        <Card className={"shadow-none"}>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Credential" : "Create Credential"}
            </CardTitle>
            <CardDescription>
              {isEditing ? "Update your API key or credential details" : "Add new API key or credential to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
                    className={"space-y-6"}
              >
                <FormField render={({field}) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder={"My Credential Name"}
                               {...field}
                               autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )} name={"name"} control={form.control}
                />
                <FormField render={({field}) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={"w-full"}>
                            <SelectValue/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {credentialTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className={"flex items-center gap-2"}>
                                  <Image src={option.logo} alt={option.label} width={16} height={16}/>
                                  {option.label}
                                </div>
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                )} name={"type"}
                           control={form.control}
                />
                <FormField render={({field}) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder={"sk-..."}
                               {...field}
                               type={"password"}
                               autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )} name={"value"} control={form.control}
                />
                <div className={"flex gap-4"}>
                  <Button type={"submit"} disabled={createCredential.isPending || updateCredential.isPending}>
                    {isEditing ? "Update" : "Create"}
                  </Button>
                  <Button asChild
                          type={"button"}
                          variant={"outline"}>
                    <Link href={"/credentials"} prefetch>
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </>
  )
}


export const CredentialView = ({credentialId}: { credentialId: string }) => {

  const {data: credential} = useSuspenseCredential(credentialId)

  return <CredentialForm initialData={credential}/>
}