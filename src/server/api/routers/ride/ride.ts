/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure
} from "$/server/api/trpc";
import { RideStatus, RideType } from "@prisma/client";

// API definition for rides
export const rideRouter = createTRPCRouter({
  rideList: protectedProcedure.query(async ({ ctx }) => {
    const rideList = ctx.db.ride.findMany({
      where: {
        isForGroup: false,
      },
      include: {
        driver: {
          select:
          {
            name: true,
            image: true,
          }
        }}
    });
    return rideList;
  }),

  // Get all rides where the user is driver include their bookings include passengers details 
  rideListAsDriver: protectedProcedure.query(async ({ ctx }) => {
    const rideListAsDriver = await ctx.db.ride.findMany({
      where: {
        isForGroup: false,
        driverId: ctx.session.user.id,
      },
      include: {
        passengers: true
      }
    });
    return rideListAsDriver;
  }),
  

  // Get all rides with driver data where the user is as passenger
  rideListAsPassengerIncDriverData: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const rideListAsPassengerIncDriverData = await ctx.db.ride.findMany({
        where: {
          isForGroup: false,
          passengers: {
            some: {
              userId: input.userId,
            },
          },
        },
        include: {
          driver: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
      return rideListAsPassengerIncDriverData;
    }),

  rideByGroup: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ride.findMany({
        where: {
          groupId: input.groupId,
          isForGroup: true,
        },
      });
    }),

  rideById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ride.findUnique({
        where: { id: input.id },
        include: {
          driver: true
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string(),
        departure: z.string(),
        departureLatitude: z.number(),
        departureLongitude: z.number(),
        departureDateTime: z.date(),
        arrivalDateTime: z.date(),
        destination: z.string(),
        destinationLatitude: z.number(),
        destinationLongitude: z.number(),
        returnTime: z.date().nullable(),
        maxBookings: z.number(),
        maxDetour: z.number(),
        type: z.nativeEnum(RideType),
        isForGroup: z.boolean().default(false),
        groupId: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.ride.create({
        data: {
          driverId: input.driverId,
          departure: input.departure,
          departureLatitude: input.departureLatitude,
          departureLongitude: input.departureLongitude,
          departureDateTime: input.departureDateTime,
          arrivalDateTime: input.arrivalDateTime,
          destination: input.destination,
          destinationLatitude: input.destinationLatitude,
          destinationLongitude: input.destinationLongitude,
          returnTime: input.returnTime,
          maxPassengers: input.maxBookings,
          maxDetourDist: input.maxDetour,
          type: input.type,
          isForGroup: input.isForGroup,
          groupId: input.groupId,
          status: RideStatus.CREATED,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        driverId: z.string(),
        departure: z.string(),
        departureLatitude: z.number(),
        departureLongitude: z.number(),
        departureDateTime: z.date(),
        arrivalDateTime: z.date(),
        destination: z.string(),
        destinationLatitude: z.number(),
        destinationLongitude: z.number(),
        returnTime: z.date().nullable(),
        maxBookings: z.number(),
        maxDistance: z.number(),
        type: z.nativeEnum(RideType),
        status: z.nativeEnum(RideStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.ride.update({
        where: { id: input.id },
        data: {
          driverId: input.driverId,
          departure: input.departure,
          departureLatitude: input.departureLatitude,
          departureLongitude: input.departureLongitude,
          departureDateTime: input.departureDateTime,
          arrivalDateTime: input.arrivalDateTime,
          destination: input.destination,
          destinationLatitude: input.destinationLatitude,
          destinationLongitude: input.destinationLongitude,
          returnTime: input.returnTime,
          maxPassengers: input.maxBookings,
          maxDetourDist: input.maxDistance,
          type: input.type,
          status: input.status,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.nativeEnum(RideStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.ride.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.ride.delete({
        where: { id: input.id },
      });
    }),
});
