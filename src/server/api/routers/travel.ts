import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "$/server/api/trpc";
import { create } from "domain";


// API definition for travels
export const travelRouter = createTRPCRouter({

    travelList: protectedProcedure.query(async ({ ctx }) => {
        const travelList =  ctx.db.travel.findMany();
        return travelList;
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
                departure: z.string().min(1),
                departureLatitude : z.number(),
                departureLongitude : z.number(), 
                departureDateTime: z.date(),
                destination: z.string().min(1),
                destinationLatitude : z.number(),
                destinationLongitude : z.number(), 
                returnDateTime: z.date(),
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
                    status: input.status,
                },
            });
        }),
});
