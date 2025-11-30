import {inngest} from "./client";
import {NonRetriableError} from "inngest";
import prisma from "@/lib/db";
import {topologicalSort} from "@/inngest/utils";
import {NodeType} from "@/generated/prisma/enums";
import {getExecutor} from "@/features/executions/lib/executor-registry";
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {googleFormChannel} from "@/inngest/channels/google-form-channel";
import {stripeChannel} from "@/inngest/channels/stripe-channel";
import {geminiChannel} from "@/inngest/channels/gemini";
import {openAiChannel} from "@/inngest/channels/openai";
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";


export const executeWorkflow = inngest.createFunction(
    {id: "execute-workflows"},
    {
      event: "workflows/execute.workflow",
      channels: [httpRequestChannel(), googleFormChannel(), stripeChannel(), geminiChannel(), openAiChannel(), manualTriggerChannel()]
    },
    async ({event, step, publish}) => {

      const workflowId = event.data.workflowId

      if (!workflowId) throw new NonRetriableError("Workflow id not found")

      const sortedNodes = await step.run("prepare-workflow", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: workflowId
          }, include: {
            nodes: true,
            connections: true
          }
        })

        return topologicalSort(workflow.nodes, workflow.connections)
      })

      //  Initialize the context with any initial data from the trigger
      let context = event.data.initialData || {}

      //  Execute each node
      for (const node of sortedNodes) {
        const executor = getExecutor(node.type as NodeType)

        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context, step,
          publish
        })
      }


      return {
        workflowId,
        result: context
      }
    }
);


