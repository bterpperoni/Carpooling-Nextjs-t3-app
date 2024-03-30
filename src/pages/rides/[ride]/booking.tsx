/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useApiKey } from "$/context/google";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import Autocomplete  from 'react-google-autocomplete';
import { useRouter } from "next/dist/client/router";
import { signIn, useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useEffect, useState } from "react";
import useDistanceCalculator from '$/hook/distanceMatrix';
import Button from "$/lib/components/button/Button";



export default function Booking() {
    // ________________________________ STATE ________________________________
    const apiKey = useApiKey();
    // Get id from url
    const { query, push } = useRouter();
    const id = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    //  Max distance driver can go to pick up passenger
    const maxDistance: number|null = ride?.maxDetourDist ?? 0;
    // Address of departure (got from 'ride' object) and destination from google autocomplete (Place Result object)
    const address: {  
        departure: string | null, 
        destination: google.maps.places.PlaceResult | null 
    } = { 
        departure: ride?.departure ?? null, 
        destination: null 
    };
    // Address of destination (formatted address)
    const [destination, setDestination] = useState<string>();
    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();
    
    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
    };

    // ________________________________ BEHAVIOR ________________________________
    function calculDistance() {
        const distance = useDistanceCalculator(address.departure ?? '', destination ?? '');
        console.log(distance);
    }

    useEffect(() => {
        if(destination !== null) {
            console.log(destination);
        }
    }, [destination]);

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
                <div className='p-2 mt-2'>
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
                        onPlaceSelected={(place) => {
                                address.destination = place;
                                setDestination(address.destination.formatted_address);
                                if(address.destination.geometry?.location?.lat() && address.destination.geometry?.location?.lng()) {
                                    setDestinationLatitude(address.destination.geometry.location.lat());
                                    setDestinationLongitude(address.destination.geometry.location.lng()); 
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