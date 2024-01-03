import { useRouter } from "next/dist/client/router";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import TravelDetail from "$/lib/components/travel/TravelDetail";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import Map from "$/lib/components/map/Map";
import { Marker } from "@react-google-maps/api";
import { useEffect, useRef } from "react";


const Detail = () => {
    // Get id from url
    const router = useRouter()
    const id = parseInt(router.query.detail as string);  
    // Session recovery
    const { data: sessionData } = useSession();
    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});
    // Get lat & lng of departure & destination
    const departureLatLng: google.maps.LatLngLiteral = { lat: travel?.departureLatitude as number, lng: travel?.departureLongitude as number };
    const destinationLatLng: google.maps.LatLngLiteral = { lat: travel?.destinationLatitude as number, lng: travel?.destinationLongitude as number };
    // Map options
    const center: google.maps.LatLngLiteral =  { lat: travel?.departureLatitude as number, lng: travel?.departureLongitude as number };
    const zoom: number = 12;

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

  if(!travel) return <div>Travel not found</div>
  return (
    <>
        <LayoutMain>
            <Map center={center} zoom={zoom} onLoad={mapLoaded}>
                <Marker position={departureLatLng} />
                <Marker position={destinationLatLng} />
            </Map>
            <TravelDetail travel={travel} />
        </LayoutMain>
    </>
  )
}

export default Detail;