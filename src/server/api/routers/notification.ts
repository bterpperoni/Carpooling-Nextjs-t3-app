/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "$/server/api/trpc";

export const notificationRouter = createTRPCRouter({
    notificationList: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.notifications.findMany({ take: 10 });
    }),
    
    notificationListByUnread: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.notifications.findMany({
            where: { read: false },
        });
    }),

    notificationById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
        return ctx.db.notifications.findUnique({
            where: { id: input.id },
        });
        }),
    
    create: protectedProcedure
        .input(
        z.object({
            userId: z.string(),
            message: z.string(),
            read: z.boolean(),
        })
        )
        .mutation(async ({ ctx, input }) => {
        return ctx.db.notifications.create({
            data: {
                userId: input.userId,
                message: input.message,
                read: input.read,
                createdAt: new Date()
            },
        });
        }),
    
    update: protectedProcedure
        .input(
        z.object({
            id: z.number(),
            userId: z.string(),
            message: z.string(),
            read: z.boolean(),
        })
        )
        .mutation(async ({ ctx, input }) => {
        return ctx.db.notifications.update({
            where: { id: input.id },
            data: {
            userId: input.userId,
            message: input.message,
            read: input.read,
            },
        });
        }),
    });
