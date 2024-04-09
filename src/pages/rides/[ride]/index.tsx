/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import Map from "$/lib/components/map/Map";
import LayoutMain from '../../../lib/components/layout/LayoutMain';
import RideDetail from "$/lib/components/ride/RideDetail";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display details of a specific ride ------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function Detail() {

    // Used to redirect after delete
    const [ rideDeleted, setrideDeleted ] = useState(false);
    // Get id from url
    const { query, push } = useRouter();
    const id = query.ride;
    // Session recovery
    const { data: sessionData } = useSession();
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    // Used to delete ride
    const { mutate: deleteride } = api.ride.delete.useMutation();
    // Get if a user already subscribed to this ride
    const { data: userBooking } = api.booking.userBookingByRideId.useQuery(
        {   rideId: parseInt(id as string), 
            userName: sessionData?.user?.name ?? ''
        },
        {enabled: sessionData?.user !== undefined});


    console.log(userBooking);

    // Set if ride can be edited
    const canEdit = sessionData?.user?.name === ride?.driverId;
    // Get booking id
    const bookingId = userBooking?.[0]?.id ?? '';
    
    /* -------------------------------------------------------------------------------------------- */

    // Get lat & lng of departure & destination
    const departureLatLng: google.maps.LatLngLiteral = { 
        lat: ride?.departureLatitude!, 
        lng: ride?.departureLongitude! 
    };
    const destinationLatLng: google.maps.LatLngLiteral = { 
        lat: ride?.destinationLatitude!, 
        lng: ride?.destinationLongitude!
    };
    // Map options
    const zoom = 12;
    
    // Function to display line between departure & destination
    function displayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
        directionsService.route(
            {
                origin: departureLatLng,
                destination: destinationLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        ).catch((err) => {
            console.log(err);
        });
    }
   
    // Display map with line between departure & destination after map is loaded
    function mapLoaded(map: google.maps.Map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer(
            {map: map}
        );     
        displayRoute(directionsService, directionsRenderer);
    }

    // Redirect to update ride page
      const handleEditClick = () => {
        window.location.assign(`/rides/${id as string}/update`);
    };

    // Delete ride
    const handleDelete = () => {
        deleteride({id: parseInt(id as string)});
        setrideDeleted(true);
    }

    // Check if user already subscribed to this ride
    useEffect(() => {
        if(userBooking && userBooking.length > 0) {
            console.log('Vous avez déjà réservé ce trajet. Le numéro de réservation est ' + bookingId);
        }
    }, [userBooking, bookingId]);

    // Redirect after delete
    useEffect(() => {
        if(rideDeleted) {
                alert('Trajet supprimé');
                void push('/rides');
        }
    }, [rideDeleted]);
   

  if(!ride) return <div className="text-white m-6 text-3xl m-4 w-screen text-center">ride not found</div>
  return (
    <>
        <LayoutMain>
            {/* ------------------------------------Card with ride details--------------------------------------------------- */}  
                    <>
                        <RideDetail ride={ride}>
                                    {canEdit ? (
                                        <>
                                            <div className="flex justify-between">
                                                <Button 
                                                    onClick={handleEditClick}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">
                                                    Modifier le trajet
                                                </Button>
                                                <Button
                                                    onClick={handleDelete}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">
                                                    Supprimer le trajet
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-4">
                                            {userBooking && userBooking.length === 0 ? (
                                            <>
                                                <Button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                                                    onClick={() => push(`/rides/${id as string}/bookings/create`)}>
                                                        Créer une réservation
                                                </Button>
                                            </>
                                            ) : (
                                            <>
                                                <Button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                                                    onClick={() => push(`/rides/${id as string}/bookings/${bookingId}`)}>
                                                        Voir ma réservation
                                                </Button>           
                                            </>
                                            )}
                                        </div>
                                    )}
                        </RideDetail>
                        <Map zoom={zoom} onLoad={mapLoaded}/>
                    </>
        </LayoutMain>
    </>
  )
}