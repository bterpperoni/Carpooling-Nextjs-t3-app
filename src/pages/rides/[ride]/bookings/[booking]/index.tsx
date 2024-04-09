import LayoutMain from "$/lib/components/layout/LayoutMain";
import Map from "$/lib/components/map/Map";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export default function BookingDetails() {
    // Session recovery
    const { data: sessionData } = useSession();

    // Get id of ride & booking from url
    const { query } = useRouter();
    const rideId = query.ride;
    const bookingId = query.booking;
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(rideId as string)}, {enabled: sessionData?.user !== undefined});
    // Get booking by id
    const { data: booking } = api.booking.bookingById.useQuery({id: parseInt(bookingId as string)}, {enabled: sessionData?.user !== undefined});

    // Map options
    const zoom = 12;
    const center: google.maps.LatLngLiteral =  { lat: 50.463727, lng: 3.938247 };

    useEffect(() => {

        console.log(ride);
        console.log(booking);

    }, [ride, booking]);

    // Function to display line between departure & destination
    function displayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
        // directionsService.route(
        //     {
        //         origin: departureLatLng,
        //         destination: destinationLatLng,
        //         travelMode: google.maps.TravelMode.DRIVING,
        //     },
        //     (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        //         if (status === "OK") {
        //             directionsRenderer.setDirections(response);
        //         } else {
        //             window.alert("Directions request failed due to " + status);
        //         }
        //     }
        // ).catch((err) => {
        //     console.log(err);
        // });
        console.log('displayRoute');
    }

    // Display map with line between departure & destination after map is loaded
    function mapLoaded(map: google.maps.Map) {
        // const directionsService = new google.maps.DirectionsService();
        // const directionsRenderer = new google.maps.DirectionsRenderer(
        //     {map: map}
        // );     
        // displayRoute(directionsService, directionsRenderer);
        console.log('mapLoaded');
    }

    if(sessionData){
        return (
        <LayoutMain>
            <Map center={center} zoom={zoom} />
        </LayoutMain>
        );
    }
  };