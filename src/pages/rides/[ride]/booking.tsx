/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import Button from "$/lib/components/button/Button";
// import { calculateDistance } from "$/hook/distanceMatrix";
import axios from "axios";



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
    const maxDistance: number = ride?.maxDetourDist ?? 0;
    // Is booking eligible
    const [distanceEligible, setDistanceEligible] = useState<number>(0);
    const [bookingEligible, setBookingEligible] = useState<boolean>(false);
    // Address of departure (got from 'ride' object) and destination from google autocomplete (Place Result object)
    const origin = ride?.departure ?? "";
    const [destinationBooking, setDestinationBooking] = useState<string>("");

    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();
    
    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
    };
    

    // ________________________________ BEHAVIOR ________________________________
    useEffect(() => {
        const getDistance = async () => {
            if(origin && destinationBooking){
                const distance = await calculateDistance(origin, destinationBooking);
                setDistanceEligible(parseInt(distance));
            }
        };
        console.log(origin,'\n', destinationBooking);
        console.log('Distance Eligible: ' + distanceEligible);

        void getDistance();
        
    }, [destinationBooking]);

    // Fonction pour calculer la distance entre deux adresses
    async function calculateDistance(origin: string, destination: string): Promise<string> {
        return new Promise((resolve, reject) => {
        const service = new google.maps.DistanceMatrixService();
        void service.getDistanceMatrix(
            {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                if (response && response.rows.length > 0) {
                    if(response.rows[0]?.elements[0]?.distance.value !== undefined){
                        const distance = response.rows[0]?.elements[0]?.distance.value;
                        console.log('Distance: ' + distance);
                        resolve(distance.toString());
                    }
                } else {
                console.error('Aucune réponse valide du service de calcul de distance.');
                reject(new Error('Aucune réponse valide du service de calcul de distance.'));
                }
            } else {
                console.error('Erreur lors du calcul de la distance: ' + status);
                reject(new Error('Erreur lors du calcul de la distance: ' + status));
            }
            }
        );
        });
    }

    
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