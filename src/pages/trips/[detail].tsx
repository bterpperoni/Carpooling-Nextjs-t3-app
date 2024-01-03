import { useRouter } from "next/dist/client/router";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import TravelDetail from "$/lib/components/travel/TravelDetail";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import Map from "$/lib/components/map/Map";
import { useEffect, useState } from "react";
import { set } from "zod";


export default function Detail() {
    // Get id from url
    const router = useRouter()
    const id = parseInt(router.query.detail as string);  
    // Session recovery
    const { data: sessionData } = useSession();
    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});
    // Get lat & lng of departure & destination
    const departureLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.departureLatitude as number, 
        lng: travel?.departureLongitude as number 
    };
    const destinationLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.destinationLatitude as number, 
        lng: travel?.destinationLongitude as number
    };
    // Map options
    const zoom: number = 12;
    const [ travelDeleted, setTravelDeleted ] = useState(false);

    function calculAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
        directionsService.route(
            {
                origin: departureLatLng,
                destination: destinationLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
   
    function mapLoaded(map: google.maps.Map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer(
            {map: map}
        );     

        calculAndDisplayRoute(directionsService, directionsRenderer);
    }

    const { data: deletedTravel, mutate: deleteTravel } = api.travel.delete.useMutation();

    const handleDelete = () => {
        deleteTravel({id});
        setTravelDeleted(true);
    }

    useEffect(() => {
        if(travelDeleted) {
            window.location.href = '/trips/all';
        }
    }
    , [travelDeleted]);

  if(!travel) return <div>Travel not found</div>
  return (
    <>
        <LayoutMain>
            <Map zoom={zoom} onLoad={mapLoaded} />
            <TravelDetail travel={travel}>
                <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">
                        Modifier le trajet
                </Button>
                <Button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">
                    Supprimer le trajet
                </Button>
            </TravelDetail>
        </LayoutMain>
    </>
  )
}