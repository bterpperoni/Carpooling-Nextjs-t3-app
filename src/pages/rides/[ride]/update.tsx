/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import UpdateTripForm from "$/lib/components/form/RideForm";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";

export default function UpdateRide() {

    // Get id from url
    const { query } = useRouter();
    const rideId = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(rideId as string)}, {enabled: sessionData?.user !== undefined});

    if(!ride) return <div className="text-white m-6 text-3xl m-4 w-screen text-center">ride not found</div>
    return (
        <LayoutMain>
            {/* ------------------------------------Form to update the ride--------------------------------------------------- */}
            <div className="flex flex-col items-center">
                <h2 className=" md:text-4xl 
                                text-2xl 
                                font-bold 
                                mb-4 mt-4  
                                w-[fit-content]
                                text-center 
                                text-white
                                border-y-2
                                border-fuchsia-700
                                p-4
                                rounded-[12.5%]">
                    Modifier votre trajet
                </h2>
                <UpdateTripForm ride={ride} />
            </div>
        </LayoutMain>
    );
}