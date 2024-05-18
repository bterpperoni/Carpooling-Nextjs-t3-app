/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";
import { BookingStatus, NotificationType } from "@prisma/client";
import Button from "$/lib/components/button/Button";
import { useEffect, useState } from "react";
import Map from "$/lib/components/map/Map";
// import { useMap } from "$/context/mapContext";
import type { BookingInformationsProps, Notification, OrderBookingProps, SortedBookingProps } from "$/lib/types/types";
import { notifyStatusChecked } from "$/hook/pusher/statusChecked";
import { usePusher } from "$/context/pusherContext";
import { calculateDistance, setPolilines } from "$/hook/distanceMatrix";
import { useMap } from "$/context/mapContext";
import { GiTrafficLightsRed, GiTrafficLightsGreen, GiConfirmed, GiCancel } from "react-icons/gi";
import { FaCircle, FaCircleDot, FaClock, FaHouseChimney } from "react-icons/fa6";
import { RiSchoolFill } from "react-icons/ri";
import { formatAddress, getCampusNameWithAddress } from "$/utils/data/school";
import { check } from "prettier";

export default function currentRide() {
  // Get session
  const { data: sessionData } = useSession();

  // Get rideId from url
  const { query } = useRouter();
  const rideId = query.current as string;
  // Fetch the passengers details and here details ride
  const { data: passengers } = api.booking.bookingByRideId.useQuery(
    { rideId: parseInt(rideId) ?? 0 },
    { enabled: sessionData?.user !== undefined },
  );
  // Fetch the booking details for the current user (if passenger)
  const { data: currentBookingWithUserDetails } = api.booking.userBookingByRideId.useQuery(
    { rideId: parseInt(rideId) ?? 0 },
    { enabled: sessionData?.user !== undefined },
  );

  // Fetch all checked bookings for the current ride
  const { data: checkedBookings } = api.booking.bookingCheckedByRideId.useQuery(
    { rideId: parseInt(rideId) ?? 0 },
    { enabled: sessionData?.user !== undefined },
  );
  // Boolean to determine which passenger is there
  const [isPassengerSession, setIsPassengerSession] = useState(false);

  const { data: currentRide } = api.ride.rideById.useQuery({ id: parseInt(rideId) ?? 0 }, { enabled: sessionData?.user !== undefined },);

  // Fetch the notification creation function
  const { mutate: createNotification } = api.notification.create.useMutation();

  const { data: updatedStatusChecked, mutate: updateStatusToChecked } = api.booking.updateStatusToCheck.useMutation();

  const [totalTime, setTotalTime] = useState<number | null>(0);

  // async function setTimeAndDistanceWithWayPoint() {
  //   const distanceToWaypoint = await calculateDistance(currentRide?.departure ?? "", sortedBookings[0]?.pickupPoint ?? "");
  //   const timeInMinutes = distanceToWaypoint.duration / 60;
  //   setTotalTime(parseFloat(timeInMinutes.toFixed(2)));
  //   console.log("Total time: ", totalTime);
  // }

  useEffect(() => {
    if(totalTime) {
      console.log("Total time: ", totalTime/60);
    }
  }, [totalTime]);

  

  ///

  const optimizedLegsOrder: google.maps.DirectionsLeg[] = [];

  const waypoints_order: number[]  = [];

  const orderBookings: OrderBookingProps[] = []; 

  const [orderBooking, setOrderBooking] = useState<OrderBookingProps[]>([]);

  ///
  // // Access the map object
  const mapRef = useMap();
  // // Define the state for the map loading
  const [isMapLoaded, setIsMapLoaded] = useState(false);


  ///

  const userBooking = currentBookingWithUserDetails?.find((booking) => booking.userId === sessionData?.user?.id);


  ///
  const pusher = usePusher();

  useEffect(() => {
    if (sessionData && isPassengerSession === false) {
      // Subscribe to the channel related the current driver
      const channel = pusher.subscribe(`driver-channel-${sessionData.user.id}`);

      function handleNewNotification(data: Notification) {
        alert(data.message);
      }

      // Bind to the ride-started event & add the notification to the list
      channel.bind('status-checked', handleNewNotification);

      return () => {
        channel.unbind('status-checked', handleNewNotification);
      }
    }
  }, [sessionData, isPassengerSession, currentRide]);

  ///

  async function handleNotifyStatusChecked() {

    if (currentRide && sessionData && userBooking?.userPassenger.name) {
      // set the ride informations
      const bookingInformations: BookingInformationsProps = {
        driverId: currentRide.driver.id,
        passengerName: userBooking.userPassenger.name,
      };

      // Notify the passengers
      await notifyStatusChecked(bookingInformations);
      createNotification({
        toUserId: currentRide.driver.id,
        fromUserId: sessionData.user.id,
        message: `${sessionData.user.name} a indiqué qu'il est prêt à partir ! 🚗🎉`,
        type: NotificationType.RIDE,
        read: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  useEffect(() => {
    if (updatedStatusChecked) {
      void handleNotifyStatusChecked();
    }
  }, [updatedStatusChecked]);

  ///

  const [schoolName, setSchoolName] = useState<string | undefined>();
  const [campusName, setCampusName] = useState<string | undefined>();

  useEffect(() => {
    if (currentRide) {
      const school = getCampusNameWithAddress(currentRide.destination);
      const schoolSplitted: string[] | undefined = school ? school.split(" - ") : undefined;
      setSchoolName(schoolSplitted ? schoolSplitted[0]! : "");
      setCampusName(schoolSplitted ? schoolSplitted[1]! : "");
    }
  }
    , [currentRide]);




  ///
  useEffect(() => {
    // Check if the user is a passenger
    const useruserBooking = userBooking !== undefined ? true : false;
    if (useruserBooking) {
      setIsPassengerSession(true);
    } else {
      setIsPassengerSession(false);
    }
  }, [userBooking]);


  ///
  // useEffect(() => {
    
  // }, [isMapLoaded, optimizedLegsOrder, orderBookings, sortedBookings]);

  ///

  return (
    <LayoutMain>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
          Trajets en cours
        </h2>
      </div>
      <div className="text-center">
        <div className="text-lg flex flex-col text-white mb-4">
          <div className="text-left ml-4"><span className="text-[var(--pink-g1)]">Départ prévu à </span>{currentRide?.departureDateTime.toLocaleTimeString()}</div>
          <div className="text-left ml-4"><span className="text-[var(--pink-g1)]">Arrivée vers</span> {currentRide?.arrivalDateTime.toLocaleTimeString()}</div>
        </div>

      </div>
      <div className="m-2 min-h-screen w-max-full rounded-lg bg-[var(--purple-g3)]">
        <h2 className=" w-max mx-auto border-y-2 border-gray-400 text-white md:text-3xl lg:text-4xl">
          {" "}
          Passagers pour ce trajet{" "}
        </h2>
        <div className="">
          {passengers?.map((passenger) => (
            <div key={passenger.id} className="flex flex-row p-2">
              <div className={`flex flex-row ${passenger.status === BookingStatus.CHECKED ? "bg-green-500" : "bg-red-500"} h-max my-auto border-2 p-2 rounded-lg w-max py-2`}>
                {/*  */}
                {passenger.status === BookingStatus.CHECKED ? (
                  <GiConfirmed
                  className="text-[2rem] p-1  rounded-full bg-green-500 text-white"
                  />
                ) : (
                  <GiCancel
                  className="text-[2rem] p-1  rounded-full bg-red-500 text-white"
                  />
                )}
              </div>
              <div
                className={`
                    overflow-hidden w-auto w-min-[40%] bg-[var(--purple-g3)] shadow-sm justify-end flex flex-row lg:flex-row
                  `}
              >
                <div className="pl-2 flex items-center flex-row md:flex-col">
                  <div className={`flex flex-row ${passenger.status === BookingStatus.CHECKED ? "border-green-500" : "border-red-500"} border-2 p-2 rounded-lg w-max py-2`}>
                    <img
                      src={passenger.userPassenger.image ?? "/images/logo.png"}
                      alt="profil pic of the passenger"
                      width={20}
                      height={20}
                      className="h-8 w-auto rounded-full mr-2 "
                    />
                    <h2 className={`
                         text-2xl text-center font-bold text-[1rem] md:text-xl lg:text-2xl text-white h-fit w-fit 
                      `}>
                      {passenger.userPassenger.name}
                    </h2>
                  </div>

                  {/* 
                  
                  ///
                      Passengers card status
                  
                  */}

                  {isPassengerSession && userBooking?.userId === passenger.userId ? (
                    <div>
                      <div>
                        {passenger.status !== BookingStatus.CHECKED ? (
                          <div className="flex w-full flex-row items-center justify-between">
                            <div className="text-[1rem] text-white">
                              {/* empty div */}
                            </div>
                            <div 
                              className="flex ml-4 w-full justify-end hover:transform hover:bg-red-700 hover:border-red-700 hover:text-white cursor-pointer
                                          cursor pointer pr-max px-2 flex flex-row itmes-center text-white py-1 rounded-lg bg-red-500"
                               onClick={async () => {
                                  // Update the passenger status to checked
                                  updateStatusToChecked({ bookingId: passenger.id });
                                }
                                }>
                                <GiConfirmed
                                className="text-[2rem] p-1  rounded-full bg-red-500 text-white"
                                />
                                <div className="my-auto">
                                  Confirmer
                                </div>
                            </div>
                          </div>
                        ) :
                          (
                            <div className="p-2 bg-green-500 text-white rounded-lg m-2 ">
                              Prêt
                            </div>
                          )
                        }
                      </div>
                    </div>
                  ) : (
                    <div>
                      {passenger.status !== BookingStatus.CHECKED ? (
                        <div className="">
                          <div className="text-[1rem] text-white leading-2">
                            <GiTrafficLightsRed
                              className="text-[2rem] m-2 rounded-full bg-[var(--purple-g3)] text-red-500 "
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-green-500 text-white rounded-lg m-2 ">
                              Prêt
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 
          
          ///
          */}

        <div className="mt-8">
          <Map zoom={10} onMapLoad={async () => {
            setIsMapLoaded(true);
            if (currentRide) {
              if (checkedBookings) {
                const wayPoints: string[] = checkedBookings.map((checkedBooking) => checkedBooking.pickupPoint);
                
                const sortPolylines = await setPolilines(mapRef.current, currentRide.departure, wayPoints, currentRide.destination);
                sortPolylines.routes[0] && sortPolylines.routes[0].legs.forEach((leg) => {
                  optimizedLegsOrder.push(leg);
                });

                setTotalTime(optimizedLegsOrder[0]?.duration?.value ?? 0);
                
                sortPolylines.routes[0]?.waypoint_order.forEach((order) => {
                  waypoints_order.push(order);
                });
               
                waypoints_order.forEach((sortedIndex, index) => {
                const orderBooking: OrderBookingProps = {
                  baseIndex: index,
                  sortedIndex: sortedIndex,
                  booking: checkedBookings ? checkedBookings[index] : undefined,
                  };
                  orderBookings.push(orderBooking);
                });
              }
            }
          }}
          />
        </div>

      </div>
    </LayoutMain>
  );
}
