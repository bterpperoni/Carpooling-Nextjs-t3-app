/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";

export const paypalRouter = createTRPCRouter({

    paypalTransactionList: protectedProcedure.query(async ({ ctx }) => {
        const paypalList = await ctx.db.paypalTransaction.findMany();
        return paypalList;
    }),

    paypalTransactionById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.paypalTransaction.findUnique({
                where: { id: input.id },
            });
        }),

    paypalTransactionListByUser: protectedProcedure
        .input(z.object({ walletId: z.string() }))
        .query(async ({ ctx, input }) => {
            const paypalList = await ctx.db.paypalTransaction.findMany({
                where: { walletId: input.walletId },
            });
            return paypalList;
        }),

    create: protectedProcedure
        .input(z.object(
            { 
                walletId: z.string(),
                orderId: z.string(),
                type: z.string(),
                amount: z.number()
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.paypalTransaction.create({
                data: {
                    walletId: input.walletId,
                    orderId: input.orderId,
                    type: input.type,
                    amount: input.amount
                },
            });
        }),

    update: protectedProcedure
        .input(z.object(
            { 
                id: z.number(),
                walletId: z.string(),
                amount: z.number(),
            }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.paypalTransaction.update({
                where: { id: input.id },
                data: {
                    walletId: input.walletId,
                    amount: input.amount
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.paypalTransaction.delete({
                where: { id: input.id },
            });
        }),
});