/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useRouter } from "next/dist/client/router";
import { signIn, useSession } from "next-auth/react";
import Button from "$/lib/components/button/Button";
import BookingForm from "$/lib/components/form/BookingForm";
import { api } from "$/utils/api";


/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to create booking for a ride ---------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function CreateBooking() {

    // Get session
    const { data: sessionData } = useSession();
    // Get RideId from url
    const rideId = useRouter().query.ride as string;
    // Get ride by id
    const {data: rideForBooking} = api.ride.rideById.useQuery({id: parseInt(rideId)});

    // ________________________________ RENDER ________________________________
    if(sessionData?.user) {
        return (
        <LayoutMain>
            <div className="flex flex-col items-center">
            <h2 className=" mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
                    Créer une réservation
                </h2>
                <BookingForm ride={rideForBooking ?? undefined} />
            </div>
        </LayoutMain>
        );
    }
    return (   
        <LayoutMain>
                    <h1>Not Connected, Please Sign in</h1>
                    <Button 
                        className=" m-4 
                                    rounded-full 
                                    bg-white/10 
                                    px-10 
                                    py-3 
                                    font-semibold 
                                    text-white 
                                    no-underline 
                                    transition 
                                    hover:bg-white/20" 
                        onClick={() => void signIn()}>Se connecter</Button>
        </LayoutMain>
    );
    
}