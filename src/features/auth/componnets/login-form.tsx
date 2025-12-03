"use client"
import React from 'react'
import Image from "next/image"
import Link from "next/link"

import {CardTitle, Card, CardFooter, CardContent, CardDescription, CardHeader, CardAction} from "@/components/ui/card";
import {Input} from "@/components/ui/input"
import {FormControl, FormItem, FormField, FormLabel, Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {toast} from "sonner"

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const isPending = form.formState.isSubmitting


  const signInGithub = async () => {
    await authClient.signIn.social({
          provider: "github",
        }, {
          onSuccess: () => {
            router.push("/")
          }, onError: () => {
            toast.error("Invalid email or password")
          }
        },
    )
  }


  const signInGoogle = async () => {
    await authClient.signIn.social({
          provider: "google",
        }, {
          onSuccess: () => {
            router.push("/")
          }, onError: () => {
            toast.error("Invalid email or password")
          }
        },
    )
  }

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/"
    })
  }
  return (
      <div className={"flex flex-col gap-6"}>
        <Card>
          <CardHeader className={"text-center"}>
            <CardTitle>
              Welcome Back
            </CardTitle>
            <CardDescription>
              Login to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={"grid gap-6"}>
                  <div className={"flex flex-col gap-4"}>
                    <Button
                        variant={"outline"}
                        className={"w-full"}
                        onClick={signInGithub}
                    >
                      <Image src={"/logos/github.svg"} alt={"github-logo"} width={20} height={20}/>
                      Continue with GitHub
                    </Button>
                    <Button
                        variant={"outline"}
                        className={"w-full"}
                        onClick={signInGoogle}
                    >
                      <Image src={"/logos/google.svg"} alt={"google-logo"} width={20} height={20}/>
                      Continue with Google
                    </Button>
                  </div>
                  <div className={"grid gap-6"}>
                    <FormField render={({field}) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder={"email@example.com"}
                                   {...field}
                                   type={"email"}
                            />
                          </FormControl>
                        </FormItem>
                    )} name={"email"}/>
                    <FormField render={({field}) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder={"*********"}
                                   {...field}
                                   type={"password"}
                            />
                          </FormControl>
                        </FormItem>
                    )} name={"password"}/>
                    <Button type={"submit"}
                            className={"w-full"}
                            disabled={isPending}
                    >Login</Button>
                  </div>
                  <div className={"text-center text-sm"}>
                    Don't have an account?{" "}
                    <Link href={"sign-up"}
                          className={"text-blue-500 underline"}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  )
}
export default LoginForm
