import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";

export const walletRouter = createTRPCRouter({

    walletList: protectedProcedure.query(async ({ ctx }) => {
        const walletList =  ctx.db.wallet.findMany();
        return walletList;
    }),

    walletById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.wallet.findUnique({
                where: { id: input.id },
            });
        }),

    walletByUserId: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const wallet = await ctx.db.wallet.findFirst({
                where: { userId: input.userId },
            });
            return wallet;
        }),

    create: protectedProcedure
        .input(z.object(
            { 
                balance: z.number(),
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.wallet.create({
                data: {
                    userId: ctx.session.user.id,
                    balance: input.balance,
                },
            });
        }),

    update: protectedProcedure
        .input(z.object(
            { 
                id: z.string(),
                userId: z.string(),
                balance: z.number(),
            }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.wallet.update({
                where: { id: input.id },
                data: {
                    userId: input.userId,
                    balance: input.balance,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.wallet.delete({
                where: { id: input.id },
            });
        }),
});
