/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react"; // Import the React module
import { getCampusNameWithAddress } from "$/utils/data/school";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { NotificationType, RideStatus, type Ride } from "@prisma/client";
import type { RideInformationsProps, TypeReturnRideAsPassenger } from "$/lib/types/types";
import Modal from "$/lib/components/containers/Modal";
import Button from "$/lib/components/button/Button";
import { notifyStartRide } from "$/hook/pusher/rideStart";

export default function Calendar() {
  // Get the user session
  const { data: sessionData } = useSession();

  const [checkIfModalDriverIsOpen, setCheckIfModalDriverIsOpen] =
  useState<boolean>(false);
const [checkIfModalPassengerIsOpen, setCheckIfModalPassengerIsOpen] =
  useState<boolean>(false);    

  const { data: updatedRideStatus, mutate: updateRideStatus } = api.ride.updateStatus.useMutation();

    // State for managing selected ride and modal visibility
    const [selectedRide, setSelectedRide] = useState<Ride & {
      driver: {
        name: string | null;
        email: string | null;
        image: string | null;
      };
    }| null>(null);

    // Fetch the passengers details
    const { data: passengersDetail, refetch: refetchPassengersDetails } = api.booking.bookingByRideId.useQuery(
      { rideId: selectedRide?.id ?? 0},
      { enabled: sessionData?.user !== undefined }
    );



///
  // Fetch all rides attached to the user where is passenger
  const { data: rideListAsPassenger } =
    api.ride.rideListAsPassengerIncDriverData.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: sessionData?.user !== undefined },
    );
  // Fetch all bookings attached to the user where is driver
  const { data: rideListAsDriver } = api.ride.rideListAsDriver.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined },
  );  

  // State for managing grouped rides as driver
  const [groupedRidesAsDriver, setGroupedRidesAsDriver] = useState<GroupedRides>();
  // State for managing grouped rides as passenger
  const [groupedRidesAsPassenger, setGroupedRidesAsPassenger] = useState<GroupedRides>();

  // Boolean to check when updating the ride status
  // const [isRideStatusUpdated, setIsRideStatusUpdated] = useState<boolean>(false);
  

  ///

  // New date object
  // const today = new Date().toLocaleDateString();
  // Get the next 7 days
  const next7DaysDate = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Type definition for grouping rides by date
  type GroupedRides = Record<string, Ride[] & TypeReturnRideAsPassenger[]> ;

  // Function to group rides by their departure date
  const groupRidesByDate = (rideList: Ride[]): GroupedRides => {
      return rideList.reduce((acc: GroupedRides, ride: Ride) => {
        const rideDate: string = dayjs(ride.departureDateTime).format(
          "YYYY-MM-DD",
        );
        // Initialize the key for the date if it does not exist
        if (!(acc && acc[rideDate])) {
          acc = acc ?? {};
          acc[rideDate] = [];
        }
        // Add the ride to the date key
        acc[rideDate].push(ride);
        return acc;
      }, {});
    };

///
  // Fetch the notification creation function
  const { mutate: createNotification } = api.notification.create.useMutation();

async function notifyPassenger(ride: 
      Ride & {
      driver: { 
        name: string; 
        email: string | null; 
        image: string | null 
      };
    }) {
      // set the ride informations
      const rideInformations: RideInformationsProps = {
        rideId: ride.id,
        driverId: ride.driver.name ?? "",
        destination: ride.destination
      };

      // Set passengers name List
      const listPassengers: {passengerId: string, passengerName: string}[] = [];
      // Destruct passengers list 
      passengersDetail?.forEach((passenger) => {
          // Add the passenger name to the list
          listPassengers.push({passengerId: passenger.userId, passengerName: passenger.userPassenger.name});
        });

      // Save the ride start notification in the database for each passenger
      listPassengers.map(async ({passengerId}) => {
        createNotification({
                userId: passengerId,
                message: `Le trajet avec ${sessionData?.user.name} à destination de ${getCampusNameWithAddress(rideInformations.destination) !== null ? getCampusNameWithAddress(rideInformations.destination): rideInformations.destination} a commencé ! 🚗🎉`,
                type: NotificationType.RIDE,
                read: false
        });
      });

      // Notify the passengers that the ride has started
      await notifyStartRide(rideInformations, listPassengers.map(({passengerId}) => passengerId)).then(() => {
          console.log("Les passagers ont été notifiés");
          // Redirect to the ride page after 2 seconds
          setTimeout(() => {
            location.assign(`/calendar/${ride.id}`);
          }, 2000);
      }).catch((error) => {
          console.error("Erreur lors de la notification des passagers", error);
      });

    }

    ///

  useEffect(() => {
    setGroupedRidesAsDriver(groupRidesByDate(rideListAsDriver ?? []));
    setGroupedRidesAsPassenger(groupRidesByDate(rideListAsPassenger ?? []));
  }, [rideListAsDriver]);

  useEffect(() => {
    if(selectedRide !== undefined){
      void refetchPassengersDetails();
    }
  }, [selectedRide, passengersDetail]);

  useEffect(() => {
    if(updatedRideStatus && selectedRide !== null){
      // Notify the passengers that the ride has started
        void notifyPassenger(selectedRide as Ride & {
          driver: { name: string; email: string | null; image: string | null };
        });
    }
  }, [updatedRideStatus, selectedRide]);


///

  return (
    <LayoutMain>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
          Calendrier des Trajets
        </h2>
      </div>

{/*

///
       ---------------------------------------------- as Driver ----------------------------------------------- 

///
*/}     
      <div className="m-4 rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-4 text-2xl font-semibold text-fuchsia-700">
          Trajets en tant que conducteur
        </h3>
        <div className="grid grid-rows-7  gap-4">
          {next7DaysDate.map((date, index) => {
            const isToday = dayjs(date).isSame(dayjs(), "day");
            return (
              <div
                key={index}
                className={`  
                  border-2
                  border-gray-300 col-span-1 rounded-lg p-2 shadow ${isToday ? "bg-[var(--pink-g0)]" : "bg-gray-100"}`}
              >
                <h4
                  className={`mb-2 text-xl font-semibold ${isToday ? "text-white" : "text-black"}`}
                >
                  {dayjs(date).format("dddd DD/MM")}
                </h4>
                {/* Check if the ride is available for the date */}
                {groupedRidesAsDriver?.[dayjs(date).format("YYYY-MM-DD")] !== undefined ? (
                  <>
                    {groupedRidesAsDriver?.[dayjs(date).format("YYYY-MM-DD")]?.map((ride) => {
                      return (
                        <div key={ride.id}>
                          {ride && (
                            <div
                            className={`
                              ${isToday ? "text-black" : "text-gray-600"} 
                              box-border
                              cursor-pointer 
                              mb-2
                              rounded-md 
                              bg-blue-200 
                              border-2
                              border-blue-500
                              p-2 
                              hover:bg-blue-200
                            `}
                            onClick={() => {
                              if (ride) {
                                const rideSelected = {
                                  ...ride,
                                  driver: {
                                    name: sessionData?.user.name ?? null,
                                    email: sessionData?.user.email ?? null,
                                    image: sessionData?.user.image ?? null,
                                  },
                                };
                                setSelectedRide(rideSelected);
                                setCheckIfModalDriverIsOpen(true);
                              }
                            }}
                          >
                            <p className="text-sm">
                              {ride.departure} →{" "}
                              {getCampusNameWithAddress(ride.destination) !== null
                                ? getCampusNameWithAddress(ride.destination)
                                : ride.destination}
                            </p>
                            {checkIfModalDriverIsOpen && (
                              <Modal
                                ride={
                                  selectedRide as Ride & {
                                    driver: {
                                      name: string;
                                      email: string | null;
                                      image: string | null;
                                    };
                                  }
                                }
                                isToday={dayjs(selectedRide?.departureDateTime).isSame(dayjs(), 'day')}

                                ///
                                childrenToday={
                                  <Button
                                    className="mt-4 w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700 mr-3"
                                    onClick={async () => {
                                      if (selectedRide) {
                                      // Update the ride status to IN_PROGRESS 
                                        updateRideStatus({id: selectedRide.id, status: RideStatus.IN_PROGRESS});
                                      }
                                    }}
                                  >
                                    Démarrer
                                  </Button>
                                }

                                ///
                                isOpen={checkIfModalDriverIsOpen}
                                onClose={() => {
                                  setCheckIfModalDriverIsOpen(false);
                                  setCheckIfModalPassengerIsOpen(false);
                                  setSelectedRide(null);
                                }}
                              >
                                <Button
                                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 w-full"
                                    onClick={() => location.assign(`/rides/${selectedRide?.id}`)}
                                  >
                                    Détails
                                </Button>    
                                
                              </Modal>
                            )}
                          </div>

                          )}
                        </div>
                      ); 
                  })}
                  </>
                  ):(
                    <p className={`${isToday ? "text-white" : "text-gray-600"}`}>Aucun trajet pour cette date</p>
                  )}
              </div>
            )})};
        </div>
      </div>

{/*

///
       ---------------------------------------------- as Passenger ----------------------------------------------- 

///
*/}
      <div className="m-4 rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-4 text-2xl font-semibold text-fuchsia-700">
          Trajets en tant que passager
        </h3>
        <div className="grid grid-rows-7 gap-4">
          {next7DaysDate.map((date, index) => {
            const isToday = dayjs(date).isSame(dayjs(), "day");
            return (
              <div
                key={index}
                className={`col-span-1 rounded-lg p-2 shadow ${isToday ? "bg-[var(--pink-g0)]" : "bg-gray-100"}`}
              >
                <h4 className={`mb-2 text-xl font-semibold ${isToday ? "text-white" : "text-black"}`}>
                  {dayjs(date).format("dddd DD/MM")}
                </h4>
                {groupedRidesAsPassenger?.[dayjs(date).format("YYYY-MM-DD")] !== undefined ? (
                  <>
                    {/* Check if the ride is available for the date */}
                    {groupRidesByDate(rideListAsPassenger ?? [])?.[dayjs(date).format("YYYY-MM-DD")]?.map(
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
                        className={`
                          ${isToday ? "text-black" : "text-gray-600"} 
                          box-content 
                          cursor-pointer 
                          mb-2 
                          rounded-md 
                          bg-green-200 
                          border-2
                          border-green-400
                          p-2 
                          hover:bg-green-400 
                        `}
                        onClick={() => {
                          if (ride) {
                            const rideSelected = {
                              ...ride,
                              driver: {
                                name: ride.driver.name,
                                email: ride.driver.email ?? null,
                                image: ride.driver.image ?? null,
                              },
                            };
                            setSelectedRide(rideSelected);
                            setCheckIfModalPassengerIsOpen(true);
                          }
                        }}
                      >
                        <p className="text-sm">
                          {ride.departure} →{" "}
                          {getCampusNameWithAddress(ride.destination) !== null
                            ? getCampusNameWithAddress(ride.destination)
                            : ride.destination}
                        </p>
                        {checkIfModalPassengerIsOpen && (
                          <Modal
                            ride={
                              selectedRide as Ride & {
                                driver: {
                                  name: string;
                                  email: string | null;
                                  image: string | null;
                                };
                              }
                            }
                            isToday={dayjs(selectedRide?.departureDateTime).isSame(dayjs(), 'day')}
                            childrenToday={
                              (selectedRide?.status === RideStatus.IN_PROGRESS) && (
                              <Button
                                className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700 mr-3"
                                onClick={async () => {
                                  location.assign(`/calendar/${selectedRide?.id}/`);
                                }}
                              >
                                Afficher le trajet en cours
                              </Button>
                            )}
                            isOpen={checkIfModalPassengerIsOpen}
                            onClose={() => {
                              setCheckIfModalPassengerIsOpen(false);
                              setCheckIfModalDriverIsOpen(false);
                              setSelectedRide(null);
                            }}
                          >
                            <Button
                              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                              onClick={() => location.assign(`/rides/${selectedRide?.id}`)}
                            >
                              Voir le trajet
                            </Button>
                          </Modal>
                        )}
                      </div>
                    ),
                    )}
                  </>
                ):(
                  <p className={`${isToday ? "text-white" : "text-gray-600"}`}>Aucun trajet pour cette date</p>
                )}
              </div>
          )})}
        </div>
      </div>
    </LayoutMain>
  );
}
