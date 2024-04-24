import type { NextApiRequest, NextApiResponse } from "next";
import pusher from "$/utils/pusher";
import {
  getCampusNameWithAddress,
} from "$/utils/data/school";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
if (req.method === "POST") {
    const { rideInfos, passengers } = req.body as {
        rideInfos: { rideId: number; driverId: string; destination: string},
        passengers: string[]
    };
    try {
            await Promise.all(passengers.map((userId: string) => {
                    return pusher.trigger(`passenger-channel-${userId}`, 'ride-started', {
                        message: `Le trajet à destination de ${getCampusNameWithAddress(rideInfos.destination) !== null ? getCampusNameWithAddress(rideInfos.destination): rideInfos.destination} a commencé ! 🚗🎉 N'oubliez pas de 'check' !`
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
