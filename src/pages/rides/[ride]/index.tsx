/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import Map from "$/lib/components/map/Map";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import RideDetail from "$/lib/components/containers/rides/RideDetail";
import { displayRoute } from "$/hook/distanceMatrix";
import { useMap } from "$/context/mapContext";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display details of ride ------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function Detail() {
  // Used to redirect after delete
  const [rideDeleted, setrideDeleted] = useState(false);
  // Get id from url
  const { query, push } = useRouter();
  const id = query.ride;
  // Session recovery
  const { data: sessionData } = useSession();
  // Get ride by id
  const { data: ride } = api.ride.rideById.useQuery(
    { id: parseInt(id as string) },
    { enabled: sessionData?.user !== undefined });
  // Used to delete ride
  const { mutate: deleteride } = api.ride.delete.useMutation();
  // Get if a user already subscribed to this ride
  const { data: userBooking } = api.booking.userBookingByRideId.useQuery(
    { rideId: parseInt(id as string)},
    { enabled: sessionData?.user !== undefined },
  );

  // Set if ride can be edited
  const canEdit = sessionData?.user?.id === ride?.driverId;
  // Get booking id
  const bookingId = userBooking?.[0]?.id ?? "";

  // Get lat & lng of departure & destination
  const departureLatLng: google.maps.LatLngLiteral = {
    lat: ride?.departureLatitude!,
    lng: ride?.departureLongitude!,
  };
  const destinationLatLng: google.maps.LatLngLiteral = {
    lat: ride?.destinationLatitude!,
    lng: ride?.destinationLongitude!,
  };

  // Access the map object
  const mapRef = useMap();
  
  // Used to define if the map is loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Map options
  const zoom = 13;
  /* -------------------------------------------------------------------------------------------- */

  // Redirect to update ride page
  const handleEditClick = () => {
    window.location.assign(`/rides/${id as string}/update`);
  };
  // Delete ride
  const handleDelete = () => {
    deleteride({ id: parseInt(id as string) });
    setrideDeleted(true);
  };

  // Check if user already subscribed to this ride
  useEffect(() => {
    if (userBooking && userBooking.length > 0) {
      console.log(
        "Vous avez déjà réservé ce trajet. Le numéro de réservation est " +
          bookingId
      );
    }
  }, []);

  // Redirect after delete
  useEffect(() => {
    if (rideDeleted) {
      alert("Trajet supprimé");
      void push("/rides");
    }
  }, [rideDeleted]);

  if (!ride)
    return (
      <div className="m-4 m-6 w-screen text-center text-3xl text-white">
        ride not found
      </div>
    );
  return (
    <>
      <LayoutMain>
        {/* ------------------------------------Card with ride details--------------------------------------------------- */}
        <>
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
                  Détails du trajet
                </h2>
            </div>
          <RideDetail ride={ride}>
            {canEdit ? (
              <>
                <div className="my-4 flex justify-between">
                  <Button
                    onClick={handleEditClick}
                    className="rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                  >
                    Supprimer
                  </Button>
                </div>
              </>
              ) : (
                <div className="my-4">
                  {userBooking && userBooking.length === 0 ? (
                    <>
                      <Button
                        className="mb-4 rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 mb-6"
                        onClick={() =>
                          window.location.assign(`/rides/${id as string}/bookings/create`)
                        }
                      >
                        Créer une réservation
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="mb-4 rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                        onClick={() =>
                          window.location.assign(`/rides/${id as string}/bookings/${bookingId}`)
                        }
                      >
                        Voir ma réservation
                      </Button>
                    </>
                  )}
                </div>
              )}
              <Map zoom={zoom} onMapLoad={async () => {
                    setIsMapLoaded(true);
                    if(isMapLoaded){
                      // Create the directions service & renderer
                      const directionsService = new google.maps.DirectionsService();
                      const directionsRenderer = new google.maps.DirectionsRenderer(
                        { map: mapRef.current }
                      );
                      // Display the route
                      void displayRoute(
                        directionsService,
                        directionsRenderer,
                        departureLatLng,
                        destinationLatLng,
                      );
                    }
              }}/>
          </RideDetail>
        </>
      </LayoutMain>
    </>
  );
}
