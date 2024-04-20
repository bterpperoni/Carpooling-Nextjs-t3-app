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

  type TypePassengerObject = ({driver: {name: string, email: string | null, image: string | null, }} & Ride)[]; 

  type GroupedRides = Record< string, Ride[] & TypePassengerObject>;

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


  return (
    <>
      <LayoutMain>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 mt-4 w-full text-center text-2xl font-bold text-white md:text-4xl bg-fuchsia-700 p-4 rounded-lg shadow-lg">
          Calendrier des Trajets
        </h2>
      </div>
      {/* Section pour les trajets en tant que conducteur */}
      <div className="m-4 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-fuchsia-700 mb-4">
          Trajets en tant que conducteur
        </h3>
        <div className="grid grid-rows-7  gap-4">
          {next7DaysDate.map((date, index) => (
            <div key={index} className="col-span-1 bg-gray-100 p-2 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">
                {dayjs(date).format("DD/MM/YYYY")}
              </h4>
              {groupRidesByDate(rideListAsDriver ?? [])[
                    dayjs(date).format("YYYY-MM-DD")
                  ]?.map((ride) => (
                <div key={ride.id} className="mb-2 p-2 bg-blue-100 rounded-md">
                  <p className="text-sm">{ride.departure} → {ride.destination}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Section pour les trajets en tant que passager */}
      <div className="m-4 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-fuchsia-700 mb-4">
        Trajets en tant que passager
      </h3>
        <div className="grid grid-rows-7 gap-4">
          {next7DaysDate.map((date, index) => (
            <div key={index} className="col-span-1 bg-gray-100 p-2 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">
                {dayjs(date).format("DD/MM/YYYY")}
              </h4>
              {groupRidesByDate(rideListAsPassenger ?? [])[
                  dayjs(date).format("YYYY-MM-DD")
                ]?.map((ride: Ride & {driver: {name: string, email: string | null, image: string | null, }}) => (
                <div key={ride.id} className="mb-2 p-2 bg-green-100 rounded-md">
                  <p className="text-sm">{ride.departure} → {ride.destination}</p>
                  <div className="mt-2 text-xs">
                    <p>Conducteur: {ride.driver.name}</p>
                    <p>Email: {ride.driver.email}</p>
                    {ride.driver.image && (
                      <Image width={30} height={30} src={ride.driver.image} alt="Image du conducteur" className="w-10 h-10 rounded-full mt-1"/>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </LayoutMain>
    </>

  );
}
