/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"; // Import the React module

import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";

export default function Calendar() {
  // New date object
  const today = new Date().toLocaleDateString();
  // Get the next 7 days
  const next7DaysDate = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

//   console.log("next7DaysDate: ", next7DaysDate);

  // Get the user session
  const { data: sessionData } = useSession();

  // Fetch all rides attached to the user where is passenger
  const { data: rideListAsPassenger } =
    api.ride.rideListAsPassengerIncDriverData.useQuery(
      { userName: sessionData?.user.name ?? "" },
      { enabled: sessionData?.user !== undefined },
    );
  // Fetch all bookings attached to the user where is driver
  const { data: rideListAsDriver } = api.ride.rideListAsDriver.useQuery(undefined, { enabled: sessionData?.user !== undefined });

  console.log("rideListAsDriver: ", rideListAsDriver);
  console.log("rideListAsPassenger: ", rideListAsPassenger);

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

        <div className="h-[95%] w-[95%] border-2 border-black">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">
              Trajets en tant que passager
            </h3>
            <p>{today}</p>
          </div>
          <div className="">
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
                      {booking.departure} → {booking.destination}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <p>
                      Départ:{" "}
                      {dayjs(booking.departureDateTime)
                        .toDate()
                        .toLocaleDateString()}
                    </p>
                    <p>
                      Heure de retour:{" "}
                      {dayjs(booking.returnTime).toDate().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[95%] w-[95%] border-2 border-black">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">
              Trajets en tant que conducteur
            </h3>
            <p>{today}</p>
          </div>
          <div className="">
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
                    <p className="text-sm text-gray-500">{}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-semibold">
                    {ride.departure} → {ride.destination}
                  </p>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <p>
                    Départ:{" "}
                    {dayjs(ride.departureDateTime)
                      .toDate()
                      .toLocaleString()}
                  </p>
                  {ride.returnTime && (
                    <p>
                      Heure de retour:{" "}
                      {dayjs(ride.returnTime).toDate().toLocaleTimeString()}
                    </p>
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
