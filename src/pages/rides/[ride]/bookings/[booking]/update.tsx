import Button from "$/lib/components/button/Button";
import BookingForm from "$/lib/components/form/BookingForm";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function UpdateBooking() {
    // Get session
    const { data: sessionData } = useSession();
    // Get router
    const router = useRouter();
    // Get RideId from url
    const rideId = router.query.ride as string;
    const bookingId = router.query.booking as string;
    // Get ride by id
    const {data: rideForBooking} = api.ride.rideById.useQuery({id: parseInt(rideId)});
    // Get booking by id
    const { data: bookingToUpdate } = api.booking.bookingById.useQuery({id: parseInt(bookingId)}, {enabled: sessionData?.user !== undefined});
    
    // ________________________________ RENDER ________________________________
    if(sessionData?.user) {
        return (
        <LayoutMain>
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
                    Modifier votre réservation
                </h2>
                <BookingForm ride={rideForBooking ?? undefined} booking={bookingToUpdate ?? undefined} />
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