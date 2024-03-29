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
        const rideList =  ctx.db.ride.findMany({
            where: {
                isForGroup: false
            }
        });
        return rideList;
    }),

    rideByGroup: protectedProcedure
        .input(z.object({ groupId: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.ride.findMany({
                where: {
                    groupId: input.groupId,
                    isForGroup: true
                }
            });
        }),

    rideById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.ride.findUnique({
                where: { id: input.id },
            });
        }),

    create: protectedProcedure
        .input(z.object(
            { 
                driverId: z.string(),
                departure: z.string(),
                departureLatitude : z.number(),
                departureLongitude : z.number(), 
                departureDateTime: z.date(),
                destination: z.string(),
                destinationLatitude : z.number(),
                destinationLongitude : z.number(), 
                returnTime: z.date() || null,
                maxBookings: z.number(),
                maxDetour: z.number(),
                type: z.nativeEnum(RideType),
                isForGroup: z.boolean().default(false),
                groupId: z.number().nullable(),
                status: z.nativeEnum(RideStatus),   
            }))
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
                    destination: input.destination,
                    destinationLatitude: input.destinationLatitude,
                    destinationLongitude: input.destinationLongitude,
                    returnTime: input.returnTime,
                    maxPassengers: input.maxBookings,
                    maxDetourDist: input.maxDetour,
                    type: input.type,
                    isForGroup: input.isForGroup,
                    groupId: input.groupId,
                    status: RideStatus.PENDING,
                },
            });
        }),

    update: protectedProcedure
        .input(z.object(
            { 
                id: z.number(),
                driverId: z.string(),
                departure: z.string(),
                departureLatitude : z.number(),
                departureLongitude : z.number(), 
                departureDateTime: z.date(),
                destination: z.string(),
                destinationLatitude : z.number(),
                destinationLongitude : z.number(), 
                returnTime: z.date().nullable(),
                maxBookings: z.number(),
                maxDetour: z.number(),
                type: z.nativeEnum(RideType),
                status: z.nativeEnum(RideStatus),
                
            }))
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
                    destination: input.destination,
                    destinationLatitude: input.destinationLatitude,
                    destinationLongitude: input.destinationLongitude,
                    returnTime: input.returnTime,
                    maxPassengers: input.maxBookings,
                    maxDetourDist: input.maxDetour,
                    type: input.type,
                    status: input.status
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
