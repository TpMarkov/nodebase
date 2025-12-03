import {inngest} from "./client";
import {NonRetriableError} from "inngest";
import prisma from "@/lib/db";
import {topologicalSort} from "@/inngest/utils";
import {ExecutionStatus, NodeType} from "@/generated/prisma/enums";
import {getExecutor} from "@/features/executions/lib/executor-registry";
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {googleFormChannel} from "@/inngest/channels/google-form-channel";
import {stripeChannel} from "@/inngest/channels/stripe-channel";
import {geminiChannel} from "@/inngest/channels/gemini";
import {openAiChannel} from "@/inngest/channels/openai";
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";
import {slackChannel} from "@/inngest/channels/slack";

export const executeWorkflow = inngest.createFunction(
    {
      id: "execute-workflows",
      retries: process.env.NODE_ENV === "production" ? 3 : 0,
      onFailure: async ({event, step}) => {
        return prisma.execution.update({
          where: {
            inngestEventId: event.data.event.id
          }, data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack
          }
        })
      }
    },
    {
      event: "workflows/execute.workflow",
      channels: [
        httpRequestChannel(),
        googleFormChannel(),
        stripeChannel(),
        geminiChannel(),
        openAiChannel(),
        manualTriggerChannel(),
        stripeChannel(),
        slackChannel(),
      ],
    },
    async ({event, step, publish}) => {
      const workflowId = event.data.workflowId;
      const inngestEventId = event.id

      if (!inngestEventId) {
        throw new NonRetriableError("Inngest Event: Event ID missing")
      }

      if (!workflowId) throw new NonRetriableError("Workflow id not found");

      await step.run("create-execution", async () => {
        await prisma.execution.create({
          data: {
            workflowId,
            inngestEventId
          }
        })
      })

      const sortedNodes = await step.run("prepare-workflow", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: workflowId,
          },
          include: {
            nodes: true,
            connections: true,
          },
        });

        return topologicalSort(workflow.nodes, workflow.connections);
      });

      const userId = await step.run("get-user-id", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: workflowId,
          },
          select: {
            userId: true,
          },
        });

        return workflow.userId;
      });

      //  Initialize the context with any initial data from the trigger
      let context = event.data.initialData || {};

      //  Execute each node
      for (const node of sortedNodes) {
        const executor = getExecutor(node.type as NodeType);

        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          userId,
          context,
          step,
          publish,
        });
      }

      await step.run("update-execution-status", async () => {
        return prisma.execution.update({
          where: {
            workflowId,
            inngestEventId
          }, data: {
            status: ExecutionStatus.SUCCESS,
            completedAt: new Date(),
            output: context
          }
        })
      })

      return {
        workflowId,
        result: context,
      };
    },
);
