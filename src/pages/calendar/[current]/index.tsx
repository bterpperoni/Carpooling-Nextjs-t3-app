import LayoutMain from '$/lib/components/layout/LayoutMain';
import { useSession } from 'next-auth/react';
import { api } from "$/utils/api";
import { useRouter } from 'next/router';
import { BookingStatus } from '@prisma/client';
import Button from '$/lib/components/button/Button';
import Map from '$/lib/components/map/Map';
import { useEffect, useRef } from 'react';

export default function currentRide(){
    // Get session
    const { data: sessionData } = useSession();
    // Get rideId from url
    const { query }= useRouter();
    const rideId = query.current as string;
    // Fetch the passengers details
    const { data: passengers, refetch: refetchPassengersDetails } = api.booking.bookingByRideId.useQuery(
        { rideId: parseInt(rideId) ?? 0},
        { enabled: sessionData?.user !== undefined }
    );

    // Map ref
    const mapRef = useRef<google.maps.Map | null>(null);
    
    // Map options
    const zoom = 12;
    
    // Set the map ref when it's loaded
    async function mapLoaded(map: google.maps.Map) {
      mapRef.current = map;
    }

    return (
            <LayoutMain>
                <div className="flex flex-col items-center">
                    <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
                       Trajets en cours
                    </h2>
                </div>
                <div className="bg-gray-100 min-h-screen w-[95%] m-auto rounded-lg">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {passengers?.map((passenger) => (
                            <div
                                key={passenger.id}
                                className={`bg-white overflow-hidden shadow-sm rounded-lg ${
                                    passenger.status === BookingStatus.CHECKED ? 'border-green-500' : 'border-red-500'
                                } border-2`}
                                >
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-900">{passenger.userPassenger.name}</h2>
                                    <p className="text-sm text-gray-500">{passenger.pickupPoint}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="mt-8 z-1">
                            <Map zoom={zoom} onLoad={mapLoaded} />
                        </div>
                        <Button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => {
                            // Gérez l'action lorsque le bouton est cliqué
                            console.log('Départ en cours...');
                        }}
                        >
                         En route !
                        </Button>
                    </div>
                </div>
            </LayoutMain>
        );
}