/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react"; // Import the React module
import { getCampusNameWithAddress } from "$/utils/data/school";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import type { Ride } from "@prisma/client";
import type { TypeReturnRideAsPassenger } from "$/lib/types/types";
import Modal from "$/lib/components/containers/Modal";

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

  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [checkIfModalDriverIsOpen, setCheckIfModalDriverIsOpen] = useState<boolean>(false);
  const [checkIfModalPassengerIsOpen, setCheckIfModalPassengerIsOpen] = useState<boolean>(false);

  type GroupedRides = Record<string, Ride[] & TypeReturnRideAsPassenger>;

  useEffect(() => {
    console.log("Current Ride selected: ", selectedRide);
    console.log("Modal is open: ", checkIfModalDriverIsOpen);
  } , [checkIfModalDriverIsOpen]);

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
                  className="mb-2 cursor-pointer rounded-md bg-blue-100 p-2 hover:bg-blue-200"
                >
                  <p className="text-sm" onClick={() =>  {
                    setCheckIfModalDriverIsOpen(true);
                    if(ride){
                      setSelectedRide(ride);
                    }
                  }}>
                    {ride.departure} →{" "}
                    {getCampusNameWithAddress(ride.destination) ??
                      ride.destination}
                  </p>
                  {checkIfModalDriverIsOpen && (
                    <Modal
                      ride={ride}
                      isOpen={checkIfModalDriverIsOpen}
                      onClose={async () =>  {
                        setCheckIfModalDriverIsOpen(false);
                        setSelectedRide(null);
                      }}
                    />
                  )}
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
                    className="mb-2 cursor-pointer rounded-md bg-green-100 p-2 hover:bg-green-200"
                  >
                    <p className="text-sm" onClick={() =>  {
                        setCheckIfModalPassengerIsOpen(true);
                        if(ride){
                          setSelectedRide({...ride});
                          console.log("Ride selected: ", ride);
                        }
                      }}
                    >
                      {ride.departure} →{" "}
                      {getCampusNameWithAddress(ride.destination) ??
                        ride.destination}
                    </p>
                    {/* Modal for ride details */}
                    {checkIfModalPassengerIsOpen && (
                      <Modal
                        ride={{...selectedRide} as Ride}
                        driverName={ride.driver.name}
                        driverEmail={ride.driver.email ?? undefined}
                        driverImage={ride.driver.image ?? undefined}
                        isOpen={Boolean(selectedRide)}
                        onClose={async () =>  {
                          setCheckIfModalPassengerIsOpen(false);
                          setSelectedRide(null);
                        }}
                      />
                    )}
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
