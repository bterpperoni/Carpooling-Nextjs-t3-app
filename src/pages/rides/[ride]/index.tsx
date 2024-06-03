/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { api } from "$/utils/api";
import Map from "$/lib/components/map/Map";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import RideDetail from "$/lib/components/containers/rides/RideDetail";
import { displayRoute } from "$/hook/distanceMatrix";
import { useMap } from "$/context/mapContext";
import { RiEditFill, RiDeleteBin6Fill } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { GoMoveToEnd } from "react-icons/go";
import LoaderSpinner from "$/lib/components/error/LoaderSpinner";
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
  // Get all bookings for this ride
  const { data: bookings } = api.booking.bookingByRideId.useQuery(
    { rideId: parseInt(id as string) },
    { enabled: sessionData?.user !== undefined }
  );
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

  ///

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

  ///

  // Access the map object
  const mapRef = useMap();
  
  // Used to define if the map is loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Map options
  const zoom = 13;



///

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

    return (
      <LayoutMain>
        {!ride ? (
          <LoaderSpinner />
        ) : (
          ride && 
          <>
          <div className="flex flex-col items-center">
              <h2 className=" mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
                  Détails du trajet
                </h2>
            </div>
          <RideDetail ride={ride} driver={ride?.driver.name} imageDriver={ride?.driver.image ?? ""}>
            {canEdit ? (
              <>
                <div className="my-4 flex justify-end">
                  <RiEditFill
                    onClick={handleEditClick}
                    className="h-[2rem] w-[2rem] p-1 hover:border-gray-500 border-2 border-blue-500 mr-2 text-blue-500 hover:text-gray-500 cursor-pointer"
                  >
                    Modifier votre trajet
                  </RiEditFill>
                  <RiDeleteBin6Fill 
                    onClick={handleDelete}
                    className="h-[2rem] w-[2rem] p-1 hover:border-gray-500 border-2 border-red-500 text-red-500 hover:text-gray-500 cursor-pointer"
                  >
                    Supprimer
                  </RiDeleteBin6Fill>
                </div>
              </>
              ) : (
                <div className="my-4 flex justify-end ">
                  {userBooking && ride?.maxPassengers && userBooking.length === 0  ? (
                    <>
                    {bookings && bookings.length < ride.maxPassengers ? (
                      <div 
                        className="flex flex-row items-center p-1 hover:text-gray-500 text-blue-500 hover:border-gray-500 border-blue-500 border-2 cursor-pointer"
                        onClick={() =>
                            window.location.assign(`/rides/${id as string}/bookings/create`)
                          }
                      >
                        <MdAddBox
                          className="h-[2rem] w-[2rem] p-1 mr-1 "
                        />
                        <span>Réserver</span>
                      </div>
                    ): (
                      <>
                        <MdAddBox
                          className="h-[2rem] w-[2rem]  p-1 mr-1 cursor-not-allowed"
                        />
                        <span className="text-blue-500">Aucune place disponible</span>
                      </>
                    )}
                    </>
                  ) : (
                    <div 
                      className="flex flex-row items-center p-1 hover:text-gray-500 text-blue-500 hover:border-gray-500 border-blue-500 border-2 cursor-pointer"
                      onClick={() =>
                        window.location.assign(`/rides/${id as string}/bookings/${bookingId}`)
                      }
                      >
                      <span>Voir ma réservation</span>
                      <GoMoveToEnd
                        className="h-[2rem] w-[2rem] p-1 mr-1"
                      />
                    </div>
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
        )}
      </LayoutMain>
    );
}
