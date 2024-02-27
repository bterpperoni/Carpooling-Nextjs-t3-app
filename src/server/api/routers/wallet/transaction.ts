import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";

export const transactionRouter = createTRPCRouter({

    transactionList: protectedProcedure.query(async ({ ctx }) => {
        const transactionList =  ctx.db.transaction.findMany();
        return transactionList;
    }),

    transactionById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction.findUnique({
                where: { id: input.id },
            });
        }),

    create: protectedProcedure
        .input(z.object(
            { 
                amount: z.number(),
                fromWalletId: z.string(),
                toWalletId: z.string(),
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.transaction.create({
                data: {
                    amount: input.amount,
                    fromWalletId: input.fromWalletId,
                    toWalletId: input.toWalletId,
                },
            });
        }),

    update: protectedProcedure
        .input(z.object(
            { 
                id: z.number(),
                amount: z.number(),
                fromWalletId: z.string(),
                toWalletId: z.string(),
            }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.transaction.update({
                where: { id: input.id },
                data: {
                    amount: input.amount,
                    fromWalletId: input.fromWalletId,
                    toWalletId: input.toWalletId,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.transaction.delete({
                where: { id: input.id },
            });
        }),
});