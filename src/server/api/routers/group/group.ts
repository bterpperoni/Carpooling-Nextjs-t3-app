
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";

export const groupRouter = createTRPCRouter({

    groupList: protectedProcedure.query(async ({ ctx }) => {
        const groupList =  ctx.db.group.findMany();
        return groupList;
    }),

    groupListByUser: protectedProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ ctx }) => {
            const groupList =  ctx.db.group.findMany({
                where: { createdBy: ctx.session.user.name },
            });
            return groupList;
        }),

    groupById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.group.findUnique({
                where: { id: input.id },
            });
        }),

    create: protectedProcedure
        .input(z.object(
            { 
                name: z.string(),
                campus: z.string(),
                createdBy: z.string(),
                visibility: z.boolean(),
                
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.group.create({
                data: {
                    name: input.name,
                    campus: input.campus,
                    createdBy: ctx.session.user.name,
                    visibility: input.visibility
                },
            });
        }),

    update: protectedProcedure
        .input(z.object(
            { 
                id: z.number(),
                name: z.string(),
                campus: z.string(),
                createdBy: z.string(),
                visibility: z.boolean(),
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.group.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    campus: input.campus,
                    createdBy: ctx.session.user.name,
                    visibility: input.visibility
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number()}))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.group.delete({
                where: { id: input.id },
            });
        }),
});