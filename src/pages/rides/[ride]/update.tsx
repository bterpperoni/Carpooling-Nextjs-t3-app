/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import LoaderSpinner from "$/lib/components/error/LoaderSpinner";
import UpdateTripForm from "$/lib/components/form/RideForm";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";


/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to update ride -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function UpdateRide() {

    // Get id from url
    const { query } = useRouter();
    const rideId = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(rideId as string)}, {enabled: sessionData?.user !== undefined});

    if(!ride) return 
    <LayoutMain>
        <LoaderSpinner />
    </LayoutMain>
    return (
        <LayoutMain>
            {/* ------------------------------------Form to update the ride--------------------------------------------------- */}
            <div className="flex flex-col items-center">
                <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
                    Modifier votre trajet
                </h2>
                <UpdateTripForm ride={ride} />
            </div>
        </LayoutMain>
    );
}