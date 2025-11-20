import {inngest} from "./client";
import prisma from "@/lib/db";

export const createWorkflow = inngest.createFunction(
    {id: "create-workflow"},
    {event: "create/workflow"},
    async ({event, step}) => {


      return step.run("create-workflow", () => {
        return prisma.workflow.create({
          data: {
            name: event.data.name,
          }
        });
      });
    },
);