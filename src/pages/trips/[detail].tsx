/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import Map from "$/lib/components/map/Map";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import TravelDetail from "$/lib/components/travel/TravelDetail";
import NewTripForm from "$/lib/components/form/NewTripForm";


export default function Detail() {
    // Used to switch between display & edit mode
    const [isEditing, setIsEditing] = useState(false);
    // Used to redirect after delete
    const [ travelDeleted, setTravelDeleted ] = useState(false);
    // Get id from url
    const router = useRouter()
    const id = parseInt(router.query.detail as string);  
    // Session recovery
    const { data: sessionData } = useSession();
    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});
    // Used to delete travel
    const { mutate: deleteTravel } = api.travel.delete.useMutation();
    // Set if travel can be edited
    const canEdit = sessionData?.user?.id === travel?.driverId;

    /* -------------------------------------------------------------------------------------------- */

    // Get lat & lng of departure & destination
    const departureLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.departureLatitude!, 
        lng: travel?.departureLongitude! 
    };
    const destinationLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.destinationLatitude!, 
        lng: travel?.destinationLongitude!
    };
    // Map options
    const zoom = 12;
    
    // Function to display line between departure & destination
    function calculAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
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
        calculAndDisplayRoute(directionsService, directionsRenderer);
    }

    // Enable edit mode & set travel data in form fields
      const handleEditClick = () => {
        setIsEditing(true);
    };
    
    

    // Delete travel
    const handleDelete = () => {
        deleteTravel({id});
        setTravelDeleted(true);
        if(travelDeleted) {
            window.location.href = '/trips/all';
        }
    }
   

  if(!travel) return <div>Travel not found</div>
  return (
    <>
        <LayoutMain>
            {/* ------------------------------------Card with travel details--------------------------------------------------- */}  
                {!isEditing ? (
                    <>
                        <Map zoom={zoom} onLoad={mapLoaded}/>
                        <TravelDetail travel={travel}>
                                    {canEdit ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                                                onClick={() => alert('not implemented')}>
                                                Réserver
                                            </Button>
                                        </>
                                    )}
                        </TravelDetail>
                    </>
                ) : (
                    <>
            {/* ------------------------------------Form to update the travel--------------------------------------------------- */}
                        <div className="flex flex-col items-center">
                            <h2 className=" md:text-4xl 
                                            text-2xl 
                                            font-bold 
                                            mb-4 mt-4  
                                            w-[fit-content]
                                            text-center 
                                            text-white
                                            border-2
                                            border-fuchsia-700
                                            p-4
                                            rounded-[12.5%]">
                                Modifier votre trajet
                            </h2>
                            <NewTripForm travel={travel} />                       
                           
                        </div>
                    </>
                )}
        </LayoutMain>
    </>
  )
}