import React from "react"; // Import the React module
import { getCampusNameWithAddress } from "$/utils/data/school";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";
import type { Ride } from "@prisma/client";

export default function Calendar(): JSX.Element {
  // Get the user session
  const { data: sessionData } = useSession();

  // Fetch all rides attached to the user where is passenger
  const { data: rideListAsPassenger } =
    api.ride.rideListAsPassengerIncDriverData.useQuery(
      { userName: sessionData?.user.name ?? "" },
      { enabled: sessionData?.user !== undefined },
    );
  // Fetch all bookings attached to the user where is driver
  const { data: rideListAsDriver } = api.ride.rideListAsDriver.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined },
  );

  // New date object
  const today = new Date().toLocaleDateString();
  // Get the next 7 days
  const next7DaysDate = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  type GroupedRides = Record<string, Ride[]>;

  const groupRidesByDate = (rideListAsDriver: Ride[]): GroupedRides => {
    return rideListAsDriver.reduce((acc: GroupedRides, ride: Ride) => {
      const rideDate: string = dayjs(ride.departureDateTime).format(
        "YYYY-MM-DD",
      );
      // Initialize the key for the date if it does not exist
      if (!acc[rideDate]) {
        acc[rideDate] = [];
      }
      // Add the ride to the date key
      acc[rideDate].push(ride);
      return acc;
    }, {});
  };

  console.log(
  "Ride as driver grouped by date: " ,groupRidesByDate(rideListAsDriver ?? []),"\n",
  "Ride as passenger grouped by date: ", groupRidesByDate(rideListAsPassenger ?? []));


  return (
    <>
      <LayoutMain>
        <div className="flex flex-col items-center">
          <h2
            className=" mb-4 
                        mt-4 
                        w-[fit-content] 
                        rounded-[12.5%] border-y-2  
                        border-fuchsia-700
                        p-4 
                        text-center
                        text-2xl
                        font-bold
                        text-white
                        md:text-4xl"
          >
            Calendrier
          </h2>
        </div>
        <div className="mx-auto mt-8 max-w-5xl rounded bg-white p-8 shadow-md">
          Display the rides calendar here :
          <br />
          1) Get all user rides & booking attached
          <br />
          2) Set UI with the next 7 days and UI for a ride as passenger or
          driver (split the UI in 2 parts)
          <br />
          3) Display the rides for each day
          <br />
        </div>

        <div className="m-4 h-[95%] w-[95%] border-2 border-black">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">
              Trajets en tant que passager
            </h3>
            <p>{today}</p>
          </div>
          <div className="m-4 ">
            {rideListAsPassenger?.map((booking) => (
              <div key={booking.id}>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                  <div className="mb-4 flex items-center">
                    <Image
                      width={40}
                      height={40}
                      src={booking.driver.image ?? "/avatar.png"}
                      alt="Avatar de l'utilisateur"
                      className="mr-3 h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{booking.driver.name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.driver.email}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">
                      {booking.departure} →{" "}
                      {getCampusNameWithAddress(booking.destination) ??
                        booking.destination}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <p>
                      Départ: {booking.departureDateTime.toLocaleDateString()}
                    </p>
                    {booking.returnTime ? (
                      <p>
                        Heure de retour:{" "}
                        {booking.returnTime?.toLocaleTimeString()}
                      </p>
                    ) : (
                      <p>Pas de retour</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="m-4 h-[95%] w-[95%] border-2 border-black">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">
              Trajets en tant que conducteur
            </h3>
            <p>{today}</p>
          </div>
          <div className="m-4">
            {rideListAsDriver?.map((ride) => (
              <div
                key={ride.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow"
              >
                <div className="mb-4 flex items-center">
                  <Image
                    width={40}
                    height={40}
                    src={sessionData?.user.image ?? "/avatar.png"}
                    alt="Avatar de l'utilisateur"
                    className="mr-3 h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{sessionData?.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {sessionData?.user.email}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-semibold">
                    {ride.departure} →{" "}
                    {getCampusNameWithAddress(ride.destination) ??
                      ride.destination}
                  </p>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <p>
                    Départ:{" "}
                    {dayjs(ride.departureDateTime).toDate().toLocaleString()}
                  </p>
                  {ride.returnTime ? (
                    <p>
                      Heure de retour: {ride.returnTime?.toLocaleTimeString()}
                    </p>
                  ) : (
                    <p>Pas de retour</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutMain>
    </>
  );
}
