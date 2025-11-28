import type {NodeExecutor, WorkflowContext} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import ky, {type Options} from "ky"
import Handlebars from "handlebars"
import {httpRequestChannel} from "@/inngest/channels/http-request";

interface HttpRequestData {
  variableName?: string
  endpoint?: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
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


  try {

    const result = await step.run("execute-request", async () => {
      try {
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


        const method = data.method

        // Compiles the result from the request so that it can be used on to the next request
        const endpoint = Handlebars.compile(data.endpoint)(context)

        // Validate URL
        try {
          new URL(endpoint)
        } catch (e) {
          throw new NonRetriableError(`Invalid URL: '${endpoint}'. Please ensure the endpoint is a valid URL.`)
        }

        const options: Options = {method}

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
      } catch (error) {
        // Publish error status immediately when the request fails
        console.log('[httpRequestExecutor] Publishing error status for node:', nodeId, error)
        await publish(httpRequestChannel().status({
          nodeId,
          status: "error"
        }))
        console.log('[httpRequestExecutor] Error status published for node:', nodeId)

        // Re-throw as NonRetriableError to prevent Inngest from retrying
        throw new NonRetriableError(
            error instanceof Error ? error.message : "HTTP request failed"
        )
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
  } catch (error) {
    // This catch block handles errors that occur outside step.run()
    // Errors inside step.run() are already handled above
    console.log('[httpRequestExecutor] Outer catch - error already published for node:', nodeId)
    throw error
  }
}