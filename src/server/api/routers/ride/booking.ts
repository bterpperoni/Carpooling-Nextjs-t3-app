import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "$/server/api/trpc";
import { BookingStatus } from "@prisma/client";

export const bookingRouter = createTRPCRouter({

  bookingList: protectedProcedure.query(async ({ ctx }) => {
      return ctx.db.booking.findMany();
    }),


  bookingById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
          return ctx.db.booking.findUnique({
            where: { id: input.id },
          });
        }),
  
  bookingByRideId: protectedProcedure
  .input(
    z.object({
      rideId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    return ctx.db.booking.findMany({
      where: {
        rideId: input.rideId,
      },
    });
  }),
    

  // Get a complete booking for a specific ride by a specific userName
  userBookingByRideId: protectedProcedure
  .input(
    z.object({
      rideId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    return ctx.db.booking.findMany({
      where: {
        rideId: input.rideId,
        userPassenger: {
          id: ctx.session.user.id,
      }},
      });
    }),


  create: protectedProcedure
    .input(
      z.object({
        rideId: z.number(),
        userId: z.string(),
        pickupPoint: z.string(),
        pickupLatitude: z.number(),
        pickupLongitude: z.number(),
        price: z.string(),
        status: z.nativeEnum(BookingStatus),
      })
    ).mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.booking.create({
        data: {
          rideId: input.rideId,
          userId: input.userId,
          pickupPoint: input.pickupPoint,
          pickupLatitude: input.pickupLatitude,
          pickupLongitude: input.pickupLongitude,
          price: input.price,
          status: BookingStatus.CREATED
        },
      });
    }),


  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        rideId: z.number(),
        userId: z.string(),
        pickupPoint: z.string(),
        pickupLatitude: z.number(),
        pickupLongitude: z.number(),
        price: z.string(),
        status: z.nativeEnum(BookingStatus),
      })
    ).mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.booking.update({
        where: {
          id: input.id,
        },
        data: {
          rideId: input.rideId,
          userId: input.userId,
          pickupPoint: input.pickupPoint,
          pickupLatitude: input.pickupLatitude,
          pickupLongitude: input.pickupLongitude,
          price: input.price,
          status: BookingStatus.UPDATED,
        },
      });
    }),


  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    ).mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.booking.delete({
        where: {
          id: input.id
        },
      });
    }),
});
