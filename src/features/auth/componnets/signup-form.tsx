"use client"
import React from 'react'
import Image from "next/image"
import Link from "next/link"

import {CardTitle, Card, CardFooter, CardContent, CardDescription, CardHeader, CardAction} from "@/components/ui/card";
import {Input} from "@/components/ui/input"
import {FormControl, FormDescription, FormItem, FormField, FormLabel, FormMessage, Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {GithubIcon} from "lucide-react";
import {LetterTextIcon} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {toast} from 'sonner'

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match", path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export const SignupForm = () => {
  const router = useRouter()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
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

  const onSubmit = async (values: SignupFormValues) => {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.email
    }, {
      onSuccess: () => {
        router.push("/")
      }, onError: (err) => {
        console.error(err)
      }
    })
  }

  return (
      <div className={"flex flex-col gap-6"}>
        <Card>
          <CardHeader className={"text-center"}>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={"grid gap-6"}>
                  <div className={"flex flex-col gap-4"}>
                    <Button variant={"outline"} className={"w-full"}
                            onClick={signInGithub}
                    >
                      <Image src={"/logos/github.svg"} alt={"github-logo"} width={20} height={20}/>
                      Continue with GitHub
                    </Button>

                    <Button variant={"outline"} className={"w-full"}
                            onClick={signInGoogle}>
                      <Image src={"/logos/google.svg"} alt={"google-logo"} width={20} height={20}/>
                      Continue with Google
                    </Button>
                  </div>

                  <div className={"grid gap-6"}>
                    <FormField
                        name={"email"}
                        render={({field}) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                    placeholder={"email@example.com"}
                                    {...field}
                                    type={"email"}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={"password"}
                        render={({field}) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                    placeholder={"*********"}
                                    {...field}
                                    type={"password"}
                                />
                              </FormControl>
                              <FormMessage/>

                            </FormItem>
                        )}
                    />
                    <FormField
                        name={"confirmPassword"}
                        render={({field}) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                    placeholder={"*********"}
                                    {...field}
                                    type={"password"}
                                />
                              </FormControl>
                              <FormMessage/>

                            </FormItem>
                        )}
                    />

                    <Button type={"submit"}
                            disabled={isPending}
                            className={"w-full"}>
                      Signup
                    </Button>
                  </div>

                  <div className={"text-center text-sm"}>
                    Already have an account?{" "}
                    <Link href={"/login"} className={"text-blue-500 underline"}>
                      Login
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
