import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { z } from "zod";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectValue, SelectItem, SelectContent, SelectTrigger
} from "@/components/ui/select";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const AVAILABLE_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-pro-latest",
] as const


const formSchema = z.object({
  variableName: z.string().min(1, { message: "Variable name is required" }).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
    message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
  }),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required")
})


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<GeminiFormValues>
}

export type GeminiFormValues = z.infer<typeof formSchema>;

export const GeminiDialog = ({
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
      model: defaultValues.model || AVAILABLE_MODELS[0],
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    }
  })

  //  Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        model: defaultValues.model || AVAILABLE_MODELS[0],
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      })
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "My_Variable_Name"

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
              Gemini
              <Image src={"/logos/gemini.svg"} width={16} height={16} alt={"gemini-logo"} />
            </div>
          </DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <Input {...field} placeholder={"My_Variable_Name"} />
                <FormDescription>
                  Use this name to reference the result in other nodes:{" "}
                  {`{{${watchVariableName}.httpResponse.data}}`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} control={form.control} name={"variableName"} />
            <FormField render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder={"Select a model"}>
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem value={model} key={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The Google Gemini model to use for completion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} control={form.control} name={"model"} />


            <FormField render={({ field }) => (
              <FormItem>
                <FormLabel>System Prompt (optional)</FormLabel>
                <Textarea {...field}
                  placeholder={'You are a helpful assistant'}
                  className={"min-h-[80px] font-mono text-sm"}
                />
                <FormDescription>
                  Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values
                  or {"{{json variable}}"} to stringify objects
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} control={form.control} name={"systemPrompt"} />
            <FormField render={({ field }) => (
              <FormItem>
                <FormLabel>User Prompt (optional)</FormLabel>
                <Textarea {...field}
                  placeholder={'Summarize this text: {{json httpResponse.data}}'}
                  className={"min-h-[120px] font-mono text-sm"}
                />
                <FormDescription>
                  The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to
                  stringify objects
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} control={form.control} name={"userPrompt"} />
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