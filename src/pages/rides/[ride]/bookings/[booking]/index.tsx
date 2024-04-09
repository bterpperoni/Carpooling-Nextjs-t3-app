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
    const { query } = useRouter();
    const rideId = query.ride;
    const bookingId = query.booking;
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
    const center: google.maps.LatLngLiteral =  { lat: 50.463727, lng: 3.938247 };

    // useEffect(() => {
    //     if(ride && booking){
    //         console.log(ride);
    //         console.log(booking);
    //     }
    // }, [ride, booking]);

    // Function to display line between driver departure & passenger pickup point
    function displayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
        directionsService.route(
            {
                origin: departureLatLng,
                destination: pickpointLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
                if (status === google.maps.DirectionsStatus.OK) {
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
    async function mapLoaded(map: google.maps.Map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer(
            {map: map}
        );     
        displayRoute(directionsService, directionsRenderer);
        console.log('mapLoaded');
    }

    if(sessionData){
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

                {/* {children}   */}

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
            <Map center={center} zoom={zoom} onLoad={mapLoaded}/>
        </LayoutMain>
        );
    }
  };