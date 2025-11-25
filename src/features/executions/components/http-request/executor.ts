import type {NodeExecutor, WorkflowContext} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import ky, {type Options} from "ky"


interface HttpRequestData {
  endpoint?: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: string
}


export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
                                                                           data, nodeId, step, context
                                                                         }) => {
  // TODO : Publish "loading" state for manual trigger

  if (!data.endpoint) {
    throw new NonRetriableError("Endpoint is required.")
  }

  const result = await step.run("execute-request", async () => {
    const method = data.method || "GET"
    const endpoint = data.endpoint!

    const options: Options = {method}

    if (["POST", "PUT", "PATH"].includes(method)) {
      options.body = data.body || "{}"
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get("content-type")
    const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      }
    }

  })


// TODO: Publish "success" state for manual trigger

  return result
}