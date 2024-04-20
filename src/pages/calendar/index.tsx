import React, { useState } from "react"; // Import the React module
import { getCampusNameWithAddress } from "$/utils/data/school";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";
import type { Ride } from "@prisma/client";
import type { TypeReturnRideAsPassenger } from "$/lib/types/types";
import { Transition } from "@headlessui/react";

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
  // const today = new Date().toLocaleDateString();
  // Get the next 7 days
  const next7DaysDate = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });


    const [expandedRideId, setExpandedRideId] = useState<number | null>(null);
  
    const toggleDetails = (id: number) => {
      setExpandedRideId(expandedRideId === id ? null : id);
    };

  type GroupedRides = Record<string, Ride[] & TypeReturnRideAsPassenger>;

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
      <LayoutMain>
        <div className="flex flex-col items-center">
          <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
            Calendrier des Trajets
          </h2>
        </div>
        {/* ----------------- as Driver ------------------------- */}
        <div className="m-4 rounded-lg bg-white p-4 shadow-lg">
          <h3 className="mb-4 text-2xl font-semibold text-fuchsia-700">
            Trajets en tant que conducteur
          </h3>
          <div className="grid grid-rows-7  gap-4">
            {next7DaysDate.map((date, index) => (
              <div
                key={index}
                className="col-span-1 rounded-lg bg-gray-100 p-2 shadow"
              >
                <h4 className="mb-2 text-xl font-semibold">
                  {dayjs(date).format("DD/MM/YYYY")}
                </h4>
                {/* Check if the ride is available for the date */}
                {groupRidesByDate(rideListAsDriver ?? [])[
                  dayjs(date).format("YYYY-MM-DD")
                ]?.map((ride) => (
                  <div
                    key={ride.id}
                    className="mb-2 rounded-md bg-blue-100 p-2 cursor-pointer hover:bg-blue-200"
                  >
                    <p className="text-sm"  onClick={() => toggleDetails(ride.id)}>
                      {ride.departure} → {ride.destination}
                    </p>
                    
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ----------------- as Passenger ------------------------- */}
        <div className="m-4 rounded-lg bg-white p-4 shadow-lg">
          <h3 className="mb-4 text-2xl font-semibold text-fuchsia-700">
            Trajets en tant que passager
          </h3>
          <div className="grid grid-rows-7 gap-4">
            {next7DaysDate.map((date, index) => (
              <div
                key={index}
                className="col-span-1 rounded-lg bg-gray-100 p-2 shadow"
              >
                <h4 className="mb-2 text-xl font-semibold">
                  {dayjs(date).format("DD/MM/YYYY")}
                </h4>
                {/* Check if the ride is available for the date */}
                {groupRidesByDate(rideListAsPassenger ?? [])[
                  dayjs(date).format("YYYY-MM-DD")
                ]?.map(
                  (
                    ride: Ride & {
                      driver: {
                        name: string;
                        email: string | null;
                        image: string | null;
                      };
                    },
                  ) => (
                    <div
                      key={ride.id}
                      className="mb-2 rounded-md bg-green-100 p-2 cursor=pointer hover:bg-green-200"
                    >
                      <p className="text-sm"  onClick={() => toggleDetails(ride.id)}>
                        {ride.departure} → {ride.destination}
                      </p>
                      {/* Transition fadIn/Out DATA of the ride */}
                      <Transition
                        show={expandedRideId === ride.id}
                        enter="transition-all duration-500 ease-out"
                        enterFrom="max-h-0"
                        enterTo="max-h-[1000px]"
                        leave="transition-all duration-500 ease-in"
                        leaveFrom="max-h-[1000px]"
                        leaveTo="max-h-0"
                        className="overflow-hidden"
                      >
                          <div className="mt-2 text-xs">
                            <p>Conducteur: {ride.driver.name}</p>
                            <p>Email: {ride.driver.email}</p>
                            {ride.driver.image && (
                              <Image
                                width={30}
                                height={30}
                                src={ride.driver.image}
                                alt="Image du conducteur"
                                className="mt-1 h-10 w-10 rounded-full"
                              />
                            )}
                          </div>
                      </Transition>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </LayoutMain>
  );
}

