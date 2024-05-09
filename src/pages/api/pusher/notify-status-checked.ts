/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import pusher from "$/utils/pusher";
import type { BookingInformationsProps } from "$/lib/types/types";

// -----------------------------------------------------------------------------------------------------
// --------------------- Notify driver when passenger has checked status -------------------------------
// -----------------------------------------------------------------------------------------------------
export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
        const bookingInformations: BookingInformationsProps = req.body;

        try {  
            await pusher.trigger(`driver-channel-${bookingInformations.driverId}`, 'status-checked', {
                message: `${bookingInformations.passengerName} à indiqué qu'il est prêt à partir ! 🚗🎉`
            });   
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    } else {
        res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
