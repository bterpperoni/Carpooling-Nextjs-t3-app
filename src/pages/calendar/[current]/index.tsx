import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";
import { BookingStatus } from "@prisma/client";
import Button from "$/lib/components/button/Button";
import { useEffect, useState } from "react";
import Map from "$/lib/components/map/Map";
import { useMap } from "$/context/mapContext";

export default function currentRide() {
  // Get session
  const { data: sessionData } = useSession();
  // Get rideId from url
  const { query } = useRouter();
  const rideId = query.current as string;
  // Fetch the passengers details
  const { data: passengers } = api.booking.bookingByRideId.useQuery(
      { rideId: parseInt(rideId) ?? 0 },
      { enabled: sessionData?.user !== undefined },
    );
  // Fetch the booking details for the current user (if passenger)
  const { data: userBooking } = api.booking.userBookingByRideId.useQuery(
    { rideId: parseInt(rideId) ?? 0 },
    { enabled: sessionData?.user !== undefined },
  );
  // Boolean to determine which passenger is there
  const [isPassengerSession, setIsPassengerSession] = useState(false);

  useEffect(() => {
    if (userBooking && userBooking.length === 1) {
      const userActualPassenger = userBooking?.find(
        (passenger) => passenger.userId === sessionData?.user.id,
      );
      console.log("User actual passenger:", userActualPassenger);
      if (userActualPassenger?.userId === sessionData?.user.id) {
        setIsPassengerSession(true);
      } else {
        setIsPassengerSession(false);
      }
      // Check if the user is passenger
      console.log("User is passenger:", isPassengerSession);
    }
  }, [passengers, userBooking, isPassengerSession, sessionData?.user.id]);

  // Access the map object
  const mapRef = useMap();
  // Define the state for the map loading
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Set the map options
  useEffect(() => {
    if (isMapLoaded) {
      console.log("Map is loaded", mapRef.current);
    }
  }, [isMapLoaded]);

  return (
    <LayoutMain>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
          Trajets en cours
        </h2>
      </div>
      <div className="m-auto mt-6 min-h-screen w-[95%] rounded-lg bg-[var(--purple-g3)]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <h2 className="m-auto w-max border-y-2 border-gray-400 text-gray-600 md:text-3xl lg:text-4xl">
            {" "}
            Passagers pour ce trajet{" "}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {passengers?.map((passenger) => (
            <div
                key={passenger.id}
                className={`overflow-hidden w-full rounded-lg bg-[var(--purple-g3)] shadow-sm justify-center flex flex-col md:flex-row
                            ${passenger.status === BookingStatus.CHECKED ? "border-green-500" : "border-red-500"} 
                            border-2`}
              >
                <div className="p-2 flex flex-row md:flex-col">
                  <h2 className="pr-2 pb-1 border-red-500 text-2xl text-left font-bold 
                                 text-white border-b-2 border-r-2 mb-4 h-fit w-fit">
                    {passenger.userPassenger.name}
                  </h2>
                  <p className="text-[0.85rem] text-white sm:ml-4 md:ml-0 ml-4 mt-2 text-center leading-none">
                    {passenger.pickupPoint}
                  </p>
                </div>
                    <div className="flex justify-center items-start rounded-sm z-1">
                        {isPassengerSession &&
                        userBooking?.find(
                            (user) => user.userId === passenger.userPassenger.id,
                        ) ? (
                            <>
                            <Button
                                className="text-bold easein-out
                                            text-[1rem]
                                            m-2
                                            transform 
                                            border-2
                                            border-white 
                                            bg-red-700 px-4 py-2
                                            leading-none text-white transition duration-100
                                            hover:-translate-y-1
                                            hover:scale-110
                                            hover:border-red-200
                                            hover:bg-white
                                            hover:text-red-600
                                            hover:shadow-[0_0.5em_0.5em_-0.4em_#ffa260]
                                            rounded-lg
                                            content-center"
                            >
                                Confirmer votre participation
                            </Button>
                            </>
                        ) : (
                        <div className="bg-gray-200 p-2 rounded-lg m-2 bg-red-700 ">
                            <p className="text-[1rem] text-white leading-2">
                                Le passager n'est pas prêt
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            ))}
          </div>
          <div className="mt-8">
            <Map zoom={12} onMapLoad={async () => {
                setIsMapLoaded(true);

            }} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
}
