/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import UpdateTripForm from "$/lib/components/form/RideForm";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";

export default function UpdateTravel() {

    // Get id from url
    const { query } = useRouter();
    const ride = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: parseInt(ride as string)}, {enabled: sessionData?.user !== undefined});

    if(!travel) return <div className="text-white m-6 text-3xl m-4 w-screen text-center">Travel not found</div>
    return (
        <LayoutMain>
            {/* ------------------------------------Form to update the travel--------------------------------------------------- */}
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
                <UpdateTripForm travel={travel} />
            </div>
        </LayoutMain>
    );
}