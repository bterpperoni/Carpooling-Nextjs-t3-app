import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure
} from "$/server/api/trpc";


// API definition for travels
export const travelRouter = createTRPCRouter({

    travelList: protectedProcedure.query(async ({ ctx }) => {
        const travelList =  ctx.db.travel.findMany({
            where: {
                isForGroup: false
            }
        });
        return travelList;
    }),

    travelByGroup: protectedProcedure
        .input(z.object({ groupId: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.travel.findMany({
                where: {
                    groupId: input.groupId,
                    isForGroup: true
                }
            });
        }),

    travelById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.travel.findUnique({
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
                returnDateTime: z.date() || null,
                isForGroup: z.boolean().default(false),
                groupId: z.number().nullable(),
                status: z.number(),
                
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.travel.create({
                data: {
                    driverId: ctx.session.user.id,
                    departure: input.departure,
                    departureLatitude: input.departureLatitude,
                    departureLongitude: input.departureLongitude,
                    departureDateTime: input.departureDateTime,
                    destination: input.destination,
                    destinationLatitude: input.destinationLatitude,
                    destinationLongitude: input.destinationLongitude,
                    returnDateTime: input.returnDateTime,
                    isForGroup: input.isForGroup,
                    groupId: input.groupId,
                    status: input.status,
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
                returnDateTime: z.date().nullable(),
                status: z.number(),
                
            }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.travel.update({
                where: { id: input.id },
                data: {
                    driverId: ctx.session.user.id,
                    departure: input.departure,
                    departureLatitude: input.departureLatitude,
                    departureLongitude: input.departureLongitude,
                    departureDateTime: input.departureDateTime,
                    destination: input.destination,
                    destinationLatitude: input.destinationLatitude,
                    destinationLongitude: input.destinationLongitude,
                    returnDateTime: input.returnDateTime,
                    status: input.status,
                },
            });
        }),

        delete: protectedProcedure
            .input(z.object({ id: z.number() }))
            .mutation(async ({ ctx, input }) => {
                // simulate a slow db call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return ctx.db.travel.delete({
                    where: { id: input.id },
                });
            }),
});
