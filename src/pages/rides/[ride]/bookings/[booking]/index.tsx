/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { displayRoute } from "$/hook/distanceMatrix";
import Button from "$/lib/components/button/Button";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import Map from "$/lib/components/map/Map";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
// import { useEffect } from "react";


export default function BookingDetails() {

    // Session recovery
    const { data: sessionData } = useSession();

    // Get id of ride & booking from url
    const router = useRouter();
    const rideId = router.query.ride;
    const bookingId = router.query.booking;
    // Get ride by id
    const {data: ride} = api.ride.rideById.useQuery({id: parseInt(rideId as string)}, {enabled: sessionData?.user !== undefined});
    // Get booking by id
    const { data: booking } = api.booking.bookingById.useQuery({id: parseInt(bookingId as string)}, {enabled: sessionData?.user !== undefined});

    // Get lat & lng of driver departure & pick up point passenger
    const departureLatLng: google.maps.LatLngLiteral = { 
        lat: ride?.departureLatitude ?? 0, 
        lng: ride?.departureLongitude ?? 0
    };
    const pickpointLatLng: google.maps.LatLngLiteral = { 
        lat: booking?.pickupLatitude ?? 0, 
        lng: booking?.pickupLongitude ?? 0
    };

    // Map options
    const zoom = 12;

//  
    function mapLoaded(map: google.maps.Map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer(
            {map: map}
        );     
        displayRoute(directionsService, directionsRenderer, departureLatLng, pickpointLatLng);
    }

    if(sessionData){
      function goToUpdateBookingPage(): void {
        location.assign(`/rides/${rideId as string}/bookings/${bookingId}/update`);
      }

        return (
        <LayoutMain>
            <div className="ride-details-container">
                <div className="ride-info flex flex-row justify-between">
                  <div>
                      <span className="label">Départ:</span>
                      {ride?.departure}
                  </div>
                </div>
                <div className="ride-info flex flex-row justify-between">
                  <div>
                      <span className="label">Date de départ:</span>
                      Le {ride?.departureDateTime.toLocaleDateString()} à {ride?.departureDateTime.toLocaleTimeString()}
                  </div>
                </div>
                <div className="ride-info flex flex-row justify-between">
                  <div>
                      <span className="label">Pt. de ramassage:</span>
                      {booking?.pickupPoint}
                  </div>
                </div>
                <div className="ride-info flex flex-row justify-between">
                  <div>
                      <span className="label">Prix estimé:</span>
                      {booking?.price} €
                  </div>
                </div>
                {ride?.returnTime != null && (
                  <div className="ride-info flex flex-row justify-between">
                      <div>
                          <span className="label">Heure de retour:</span>
                          {ride.returnTime.toLocaleTimeString()}
                      </div>
                  </div>
                )}
                <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md mb-4"
                    onClick={() => goToUpdateBookingPage()}>
                        Voir ma réservation
                </Button>   
                <Map zoom={zoom} onLoad={mapLoaded} />
                <style jsx>{`
                .ride-details-container {
                  background-color: #ffffff;
                  border: 2px solid #e0e0e0;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            
                .ride-info {
                  font-size: 1rem;
                  margin-bottom: 5px;
                  border-bottom: 2px solid #1e1b1b;
                }
            
                .label {
                  font-weight: bold;
                  margin-right: 5px;
                }
                `}</style>
            </div>
        </LayoutMain>
        );
    }
  };