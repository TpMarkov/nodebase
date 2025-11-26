import type { NodeExecutor, WorkflowContext } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky"
import Handlebars from "handlebars"
import { httpRequestChannel } from "@/inngest/channels/http-request";

interface HttpRequestData {
  variableName: string
  endpoint: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: string
}

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
})

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data, nodeId, step, context,
  publish
}) => {

  console.log('[httpRequestExecutor] Publishing loading status for node:', nodeId)
  await publish(httpRequestChannel().status({
    nodeId,
    status: "loading"
  }))
  console.log('[httpRequestExecutor] Loading status published for node:', nodeId)


  if (!data.endpoint) {
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Endpoint is required.")
  }

  if (!data.variableName) {
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Variable name is required.")
  }

  if (!data.method) {
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error"
    }))
    throw new NonRetriableError("Method is required.")
  }


  const result = await step.run("execute-request", async () => {
    const method = data.method

    // Compiles the result from the request so that it can be used on to the next request
    const endpoint = Handlebars.compile(data.endpoint)(context)

    const options: Options = { method }

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context)
      JSON.parse(resolved)

      options.body = resolved
      options.headers = {
        "Content-Type": "application/json"
      }
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get("content-type")
    const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      }
    }

    return {
      ...context,
      [data.variableName]: responsePayload,
    }
  })


  // TODO: Publish "success" state for manual trigger
  console.log('[httpRequestExecutor] Publishing success status for node:', nodeId)
  await publish(httpRequestChannel().status({
    nodeId,
    status: "success"
  }))
  console.log('[httpRequestExecutor] Success status published for node:', nodeId)

  return result
}