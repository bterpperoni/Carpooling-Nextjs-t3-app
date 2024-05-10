/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import type { NextApiRequest, NextApiResponse } from "next";
import pusher from "$/utils/pusher";

// -----------------------------------------------------------------------------------------------------
// --------------------- Notify driver when passenger has checked status -------------------------------
// -----------------------------------------------------------------------------------------------------
export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
        const { bookingInfos } = req.body as { bookingInfos: { driverId: string, passengerName: string } };

        try {  
            await pusher.trigger(`user-channel-${bookingInfos.driverId}`, 'status-checked', {
                message: `${bookingInfos.passengerName} à indiqué qu'il est prêt à partir ! 🚗🎉`
            });   
            return res.status(200).json({ success: true, data: bookingInfos});
        } catch (error) {
           return  res.status(400).json({ success: false, message: error });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
