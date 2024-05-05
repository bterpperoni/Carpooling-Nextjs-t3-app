/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import type { BookingStatus } from "@prisma/client";
import pusher from "$/utils/pusher";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
if (req.method === "POST") {
    const { statusCheck, passengersAndDriver } = req.body as {
        statusCheck: { passengerName: string, status: BookingStatus },
        passengersAndDriver: string[]
    };

    try {  
        await Promise.all(passengersAndDriver.map(async (userId: string) => {
                return await pusher.trigger(`passenger-channel-${userId}`, 'ride-started', {
                    message: `${statusCheck.passengerName} à indiqué qu'il est ${statusCheck.status}`
                });
            }));
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
} else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
}
}
