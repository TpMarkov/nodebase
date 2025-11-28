import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {z} from "zod";
import {useForm} from "react-hook-form";

import {
  Select,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectGroup,
  SelectLabel,
  SelectValue, SelectItem, SelectContent, SelectTrigger
} from "@/components/ui/select";
import {useEffect, useState} from "react";

import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useReactFlow} from "@xyflow/react";

const formSchema = z.object({
  variableName: z.string().min(1, {message: "Variable name is required"}).regex(/^[A-Za-z_$][A-Za-z0-0_$]*$/, {
    message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
  }),
  endpoint: z.string().min(1, {message: "Please add a valid URL!"}),
  method: z.enum(["GET", "POST", "PATCH", "DELETE", "PUT"]),
  body: z.string().optional()
  // .refine()
})


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<HttpRequestFormValues>
}

export type HttpRequestFormValues = z.infer<typeof formSchema>;

export const HttpRequestDialog = ({
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
          endpoint: defaultValues.endpoint || "",
          method: defaultValues.method || "GET",
          body: defaultValues.body || "",
        }
  })

  //  Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      })
    }
  }, [open, defaultValues, form]);

  const watchMethod = form.watch("method")
  const watchVariableName = form.watch("variableName") || "My_Variable_Name"
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod)

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              HTTP Request
            </DialogTitle>
            <DialogDescription>
              Config settings for HTTP Request.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8 mt-4"
            >
              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <Input {...field} placeholder={"My_Variable_Name"}/>
                    <FormDescription>
                      Use this name to reference the result in other nodes:{" "}
                      {`{{${watchVariableName}.httpResponse.data}}`}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} control={form.control} name={"variableName"}/>
              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder={"Select a method"}/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"GET"}>GET</SelectItem>
                        <SelectItem value={"POST"}>POST</SelectItem>
                        <SelectItem value={"DELETE"}>DELETE</SelectItem>
                        <SelectItem value={"PATCH"}>PATCH</SelectItem>
                        <SelectItem value={"PUT"}>PUT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The HTTP method used to execute this request
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} control={form.control} name={"method"}/>
              <FormField render={({field}) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <Input {...field} placeholder={"https://api.example.com/users/{{httpResponse.data.id}}"}/>
                    <FormDescription>
                      Static URL or use {"{{variables}}"} for
                      simple values or {"{{json variable}}"} to
                      stringify objects
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
              )} control={form.control} name={"endpoint"}/>
              {showBodyField && (
                  <FormField render={({field}) => (
                      <FormItem>
                        <FormLabel>Request Body</FormLabel>
                        <Textarea {...field}
                                  placeholder={'{\n "userId": "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}", \n "items": "{{httpResponse.data.items}}",\n}'}
                                  className={"min-h-[120px] font-mono text-sm"}
                        />
                        <FormDescription>
                          JSON with template variables. Use {"{{variables}}"}
                          for simple values or {"{{json variable}}"} to
                          stringify objects
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                  )} control={form.control} name={"body"}/>
              )}
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