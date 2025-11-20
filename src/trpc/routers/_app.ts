import {createTRPCRouter, protectedProcedure} from '../init';
import prisma from "@/lib/db"
import {inngest} from "@/inngest/client";

export const appRouter = createTRPCRouter({
          createWorkflow: protectedProcedure.mutation(async ({ctx}) => {
            return inngest.send({
              name: "create/workflow",
              data: {
                name: "First name"
              }
            })
          }),
          getWorkflows: protectedProcedure.query(async (ctx) => {
            return prisma.workflow.findMany()
          })
        }
    )
;
// export type definition of API
export type AppRouter = typeof appRouter;