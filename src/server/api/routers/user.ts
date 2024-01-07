import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "$/server/api/trpc";


// API definition for users
export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),


  userList: protectedProcedure.query(async ({ ctx }) => {
    const userList =  ctx.db.user.findMany();
    return userList;
    }),

  userById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        return ctx.db.user.findUnique({
          where: { id: input.id },
        });
      }),
  
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.create({
        data: {
          name: input.name,
          email: ctx.session.user.email,
          image: ctx.session.user.image,
          // ../utils/interface.ts
        },
      });
    }),

  update: protectedProcedure
    .input(z.object(
      { 
        id: z.string(), 
        name: z.string(), 
        email: z.string().email().nullable(),     
      }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),

    updateSchool: protectedProcedure
    .input(z.object(
      { 
        id: z.string(),
        campus : z.string().nullable(),        
      }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          campus: input.campus,
        },
      });
    }),
   
    getSecretMessage: protectedProcedure.query(() => {
      return "you can now see this secret message!";
    }),
});
