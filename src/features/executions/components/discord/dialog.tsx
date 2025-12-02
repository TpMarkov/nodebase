import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {z} from "zod";
import {useForm} from "react-hook-form";

import React, {useEffect} from "react";

import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import Image from "next/image";

import {useCredentialsByType} from "@/features/credentials/hooks/use-credentials";
import {CredentialType} from "@/generated/prisma/enums";


const formSchema = z.object({
  variableName: z.string().min(1, {message: "Variable name is required"}).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
    message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
  }),
  username: z.string().optional(),
  content: z.string().min(1, {message: "Message content is required"}).max(2000, "Discord message cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL is required")
})


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<DiscordFormValues>
}

export type DiscordFormValues = z.infer<typeof formSchema>;

export const DiscordDialog = ({
                                open,
                                onOpenChange,
                                onSubmit,
                                defaultValues = {}
                              }:
                              Props
) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
        {
          variableName: defaultValues.variableName || "",
          username: defaultValues.username || "",
          content: defaultValues.content || "",
          webhookUrl: defaultValues.webhookUrl || "",
        }
  })

  //  Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        username: defaultValues.username || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      })
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myDiscord"

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }


  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className={"flex items-center justify-items-start gap-2"}>
                Discord Configuration
                <Image src={"/logos/discord.svg"} width={16} height={16} alt={"gemini-logo"}/>
              </div>
            </DialogTitle>
            <DialogDescription>
              Configure the Discord webhook settings for this node.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8 mt-4"
            >
              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <Input {...field} placeholder={"myDiscord"}/>
                    <FormDescription>
                      Use this name to reference the result in other nodes:{" "}
                      {`{{${watchVariableName}.aiResponse.data}}`}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} control={form.control} name={"variableName"}/>

              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"https://discord.com/api/webhook/..."}/>
                    </FormControl>
                    <FormDescription>
                      Get this from Discord: Channel Settings → Integrations → Webhooks
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} name={"webhookUrl"}/>

              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <Textarea {...field}
                              placeholder={'Summary: {{myGemini.text}}'}
                              className={"min-h-[80px] max-h-[150px] font-mono text-sm"}
                    />
                    <FormDescription>
                      The message to send. Use {"{{variables}}"} for simple values
                      or {"{{json variable}}"} to stringify objects
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} control={form.control} name={"content"}/>


              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Bot Username (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Workflow Bot"}/>
                    </FormControl>
                    <FormDescription>
                      Override the webhook's default username
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} name={"username"} control={form.control}/>

              <DialogFooter className="mt-4">
                <Button type={"submit"}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  )
}