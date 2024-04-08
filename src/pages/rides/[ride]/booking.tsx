/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useApiKey } from "$/context/api";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import Autocomplete  from 'react-google-autocomplete';
import { useRouter } from "next/dist/client/router";
import { signIn, useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useEffect, useState } from "react";
import Button from "$/lib/components/button/Button";
import { calculateDistance } from "$/hook/distanceMatrix";



export default function Booking() {
    // ________________________________ STATE ________________________________
    const apiKey = useApiKey();
    // Get id from url
    const { query } = useRouter();
    const id = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});

    //  Max distance driver can go to pick up passenger
    const maxDistanceDetour = ride?.maxDetourDist ?? 0;
    // Distance in kilometers between driver departure and passenger destination
    const [distanceInKilometersA, setDistanceInKilometersA] = useState<number>(0);
    // Distance in kilometers between passenger pickup point and destination
    const [distanceInKilometersB, setDistanceInKilometersB] = useState<number>(0);
    // Price of ride
    const [priceRide, setPriceRide] = useState<string>(); 

    // Is booking eligible
    const [bookingEligible, setBookingEligible] = useState<boolean>(false);
    // Address of departure (got from 'ride' object)
    const origin = ride?.departure ?? "";
    // Address of destination (got from 'ride' object)
    const destination = ride?.destination ?? "";
    // Address of pickup point + Latitude and Longitude (got from Autocomplete)
    const [destinationBooking, setDestinationBooking] = useState<string>("");
    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();
    // Price for fuel per kilometer
    const fuelPrice = 0.15;


    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
    };
    
    // ________________________________ BEHAVIOR ________________________________
    async function getDistanceAndCheckEligibility(){
        /* ----DISTANCE A--- */
        const distanceInMetersEligibility = await calculateDistance(origin, destinationBooking);
        const distanceEligibility = parseInt(distanceInMetersEligibility) / 1000;
        setDistanceInKilometersA(distanceEligibility);
        /* ----DISTANCE B--- */
        const distanceInMetersForTotal = await calculateDistance(destinationBooking, destination);
        const distanceRest = parseInt(distanceInMetersForTotal) / 1000;
        setDistanceInKilometersB(distanceRest);
        /* ----------------- */  
        if(distanceInKilometersA <= maxDistanceDetour) {
            setBookingEligible(true);
            const tmpPrice = (distanceInKilometersA + distanceInKilometersB) * fuelPrice;
            setPriceRide(tmpPrice.toFixed(2));
            console.log("Price of ride: ", priceRide);
        }else{
            setBookingEligible(false);
            return;
        }
    }

    useEffect(() => {
        if(origin && destinationBooking) {
            void getDistanceAndCheckEligibility();
        }

        console.log("Distance: ", distanceInKilometersA, " km\nMax Distance: ", maxDistanceDetour, " km");
        console.log("Booking Eligible: ", bookingEligible);
        
    }, [destinationBooking, bookingEligible, origin, distanceInKilometersA, maxDistanceDetour]);

    
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
                    Créer une réservation
                </h2>
                <div className='p-2 mt-2 flex flex-col md:flex-row'>
                    <p className='md:text-2xl text-gray-400'></p>
                    <label htmlFor="destination" 
                           className='text-[1.25rem] 
                                      md:text-2xl 
                                      text-[var(--pink-g1)] 
                                      mb-1 mr-2'>
                        Où souhaitez vous que {ride?.driverId} vous récupère ?
                    </label>
                    {/* This autocomplete will be used as destination to calcul distance from driver departure to this address */}
                    <Autocomplete
                        apiKey={apiKey}
                        options={options}
                        onPlaceSelected={async (place) => {
                            setDestinationBooking(place.formatted_address ?? "");
                                if(place.geometry?.location?.lat() && place.geometry?.location?.lng()) {
                                    setDestinationLatitude(place.geometry.location.lat());
                                    setDestinationLongitude(place.geometry.location.lng()); 
                                }
                            }
                        }
                        className=" w-[75%] 
                                    my-2 
                                    md:w-[75%]
                                    text-xl md:text-2xl
                                    text-white
                                    bg-[var(--purple-g3)] 
                                    p-2 
                                    border-2 border-[var(--purple-g1)]"
                        id="destination"
                    />
                </div>
                <div className="m-1 mt-5 p-2 flex flex-col border-t-2 border-[var(--pink-g1)]">
                    <div className="text-white text-xl">
                        <p>
                            Départ :
                            <span className="text-[var(--pink-g1)]"> {ride?.departure}</span>
                        </p>
                        <p>
                            Addresse du point de passage : 
                            <span className="text-[var(--pink-g1)]"> {destinationBooking ? destinationBooking : "Aucune addresse n'a été saisie"}</span>
                        </p>
                        <p>
                            Distance Maximum de Détour : 
                            <span className="text-[var(--pink-g1)]"> {maxDistanceDetour} km</span>
                        </p>
                    </div>
                </div>
                <div className="mt-5 p-2 flex flex-col border-y-2 border-[var(--pink-g1)]">
                    <div className="text-white text-xl">
                        <p>
                            DEPART -- POINT DE PASSAGE: 
                            <span className="text-[var(--pink-g1)]"> {distanceInKilometersA} km</span>
                        </p>
                        <p>
                            POINT DE PASSAGE -- DESTINATION: 
                            <span className="text-[var(--pink-g1)]"> {distanceInKilometersB} km</span>
                        </p>
                        <p>
                            Êtes-vous éligible à la réservation ?
                            <span className="text-[var(--pink-g1)]"> {bookingEligible ? "Oui" : "Non"}</span>
                        </p>
                        {bookingEligible &&
                            <p>
                                Prix estimé du trajet : 
                                <span className="text-[var(--pink-g1)]"> ~ {priceRide} €</span>
                            </p>
                        }
                    </div>
                </div>
                {/* Here is the beginning to add div blocks */}

            {/* Here is the global div for page */}
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
                        onClick={() => void signIn()}>Sign in</Button>
        </LayoutMain>
    );
    
}