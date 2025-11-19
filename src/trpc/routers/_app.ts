import {z} from 'zod';
import {baseProcedure, createTRPCRouter, protectedProcedure} from '../init';
import prisma from "@/lib/db"
import {TRPCError} from "@trpc/server";

export const appRouter = createTRPCRouter({
          getUsers: protectedProcedure.query(({ctx}) => {
            if (!ctx.auth.user.id) throw new TRPCError({code: "UNAUTHORIZED"});

            return prisma.user.findMany({
              where: {
                id: ctx.auth.user.id
              }
            });
          })
        }
    )
;
// export type definition of API
export type AppRouter = typeof appRouter;