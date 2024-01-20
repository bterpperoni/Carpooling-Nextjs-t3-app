import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";

export const groupMemberRouter = createTRPCRouter({
    
        groupMemberList: protectedProcedure.query(async ({ ctx }) => {
            const groupMemberList =  ctx.db.groupMember.findMany();
            return groupMemberList;
        }),
    
        groupMemberListByGroup: protectedProcedure
            .input(z.object({ groupId: z.number() }))
            .query(async ({ ctx, input }) => {
                const groupMemberList =  ctx.db.groupMember.findMany({
                    where: { groupId: input.groupId },
                });
                return groupMemberList;
            }),
    
        groupMemberListByUser: protectedProcedure
            .input(z.object({ userId: z.string() }))
            .query(async ({ ctx, input }) => {
                const groupMemberList =  ctx.db.groupMember.findMany({
                    where: { userId: input.userId },
                });
                return groupMemberList;
            }),
    
        groupMemberById: protectedProcedure
            .input(z.object({ id: z.number() }))
            .query(async ({ ctx, input }) => {
                return ctx.db.groupMember.findUnique({
                    where: { id: input.id },
                });
            }),
    
        create: protectedProcedure
            .input(z.object(
                { 
                    groupId: z.number(),
                    userId: z.string()
                    
                }))
            .mutation(async ({ ctx, input }) => {
                // simulate a slow db call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return ctx.db.groupMember.create({
                    data: {
                        groupId: input.groupId,
                        userId: input.userId
                    },
                });
            }),
    
        update: protectedProcedure
            .input(z.object(
                { 
                    id: z.number(),
                    groupId: z.number(),
                    userId: z.string()                    
                }))
            .mutation(async ({ ctx, input }) => {
                // simulate a slow db call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return ctx.db.groupMember.update({
                    where: { id: input.id },
                    data: {
                        groupId: input.groupId,
                        userId: input.userId,

                    },
                });
            }),
    
        delete: protectedProcedure
            .input(z.object({ id: z.number() }))
            .mutation(async ({ ctx, input }) => {
                // simulate a slow db call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return ctx.db.groupMember.delete({
                    where: { id: input.id },
                });
            }
        )
    }
);