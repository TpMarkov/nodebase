import type {NodeExecutor, WorkflowContext} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import ky, {type Options} from "ky"


interface HttpRequestData {
  variableName?: string
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

  if (!data.variableName) {
    throw new NonRetriableError("Variable name is required.")
  }

  const result = await step.run("execute-request", async () => {
    const method = data.method || "GET"
    const endpoint = data.endpoint!

    const options: Options = {method}

    if (["POST", "PUT", "PATCH"].includes(method)) {

      options.body = data.body || "{}"
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

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      }
    }

    //  Fallback to direct httpResponse for backward compatability

    return {
      ...context,
      ...responsePayload,
    }

  })


// TODO: Publish "success" state for manual trigger

  return result
}