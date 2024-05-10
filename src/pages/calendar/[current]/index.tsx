/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";
import { BookingStatus, NotificationType } from "@prisma/client";
import type { Booking, User } from "@prisma/client";
import Button from "$/lib/components/button/Button";
import { useEffect, useState } from "react";
import Map from "$/lib/components/map/Map";
// import { useMap } from "$/context/mapContext";
import type { BookingInformationsProps, Notification } from "$/lib/types/types";
import { notifyStatusChecked } from "$/hook/pusher/statusChecked";
import { usePusher } from "$/context/pusherContext";

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

  const { data: currentRide } = api.ride.rideById.useQuery({ id: parseInt(rideId) ?? 0 }, { enabled: sessionData?.user !== undefined },);

  // Fetch the notification creation function
  const { mutate: createNotification } = api.notification.create.useMutation();

  const { data: updatedStatusChecked ,mutate: updateStatusToChecked } = api.booking.updateStatusToCheck.useMutation();

  const [isUpdated, setIsUpdated] = useState(false);

  ///
  const pusher = usePusher();
  
  useEffect(() => {
    if(sessionData && isPassengerSession === false){
        // Subscribe to the channel related the current driver
        const channel = pusher.subscribe(`driver-channel-${sessionData.user.id}`);
        console.log("Channel subscribed: ", channel.name);
        
        function handleNewNotification(data: Notification){
          alert(data.message);
        }

        // Bind to the ride-started event & add the notification to the list
        channel.bind('status-checked', handleNewNotification);

        return () => {
          channel.unbind('status-checked', handleNewNotification);
          console.log("Channel unsubscribed: ", channel.name);
        }
    }
  }, [sessionData, isPassengerSession, currentRide]);

///
    // // Access the map object
    // const mapRef = useMap();
    // // Define the state for the map loading
    // const [isMapLoaded, setIsMapLoaded] = useState(false);  

    const currentPassenger: ({userPassenger: User } & Booking) | undefined = 
    userBooking?.find((user) => user.userId === sessionData?.user?.id);

    async function handleNotifyStatusChecked() {        

      if(currentRide && sessionData && currentPassenger?.userPassenger.name)                 
      {
        // set the ride informations
        const bookingInformations: BookingInformationsProps = {
          driverId: currentRide.driver.id,
          passengerName: currentPassenger.userPassenger.name,
        };
        
        console.log("Conducteur à notifier: ", bookingInformations.driverId);
        console.log("Nom du passager: ", bookingInformations.passengerName);
        
        // Notify the passengers
        await notifyStatusChecked(bookingInformations);
        createNotification({
          toUserId: currentRide.driver.id,
          fromUserId: sessionData.user.id,
          message: `${sessionData.user.name} a indiqué qu'il est prêt à partir ! 🚗🎉`,
          type: NotificationType.RIDE,
          read: false,
          });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      }
    }

  useEffect(() => {

    if(isUpdated){
      void handleNotifyStatusChecked();
    }
  }, [isUpdated]);

  ///
  useEffect(() => {
      // Check if the user is a passenger
      const userActualPassenger = userBooking?.find(
        (user) => user.userPassenger.id === sessionData?.user?.id
      );
      if (userActualPassenger?.userPassenger.id === sessionData?.user?.id) {
        setIsPassengerSession(true);
      } else {
        setIsPassengerSession(false);
      }
  }, [userBooking]);

  ///

  return (
      <LayoutMain>
        <div className="flex flex-col items-center">
          <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
            Trajets en cours
          </h2>
        </div>
        <div className="m-auto mt-6 min-h-screen w-[95%] rounded-lg bg-[var(--purple-g3)]">
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            <h2 className="m-auto w-max border-y-2 border-gray-400 text-white md:text-3xl lg:text-4xl">
              {" "}
              Passagers pour ce trajet{" "}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {passengers?.map((passenger) => (
              <div
                  key={passenger.id}
                  className={`
                    overflow-hidden w-full rounded-lg  shadow-sm justify-center flex flex-col lg:flex-row
                    ${passenger.status === BookingStatus.CHECKED ? "bg-green-500 text-gray-600 border-green-700" : "bg-[#C05856] border-red-700"} 
                    border-2
                  `}
                >
                  <div className="p-2 flex flex-row md:flex-col">
                    <h2 className={`
                      ${passenger.status === BookingStatus.CHECKED ? "bg-green-600 border-green-700" : "bg-red-600"}
                      rounded-lg p-2 pb-1 text-2xl text-center font-bold text-[1rem] md:text-xl lg:text-2xl text-white border-b-2 border-r-2 mb-4 h-fit w-fit
                    `}>
                      {passenger.userPassenger.name}
                    </h2>
                    <p className={` rounded-lg ${passenger.status === BookingStatus.CHECKED ? "bg-green-500 text-green-50 border-green-700" : "bg-[#C05856] text-white border-red-700"} text-[0.85rem] sm:ml-4 md:ml-0 ml-4 h-max p-2 text-center relative top-[0.2rem] `}>
                      {passenger.pickupPoint}
                    </p>
                  </div>
                      <div className="flex justify-center items-start rounded-sm z-1">
                          {isPassengerSession && userBooking?.find((user) => user.userId === passenger.userPassenger.id) ? (
                            <>
                              {passenger.status !== BookingStatus.CHECKED ? (
                                <Button
                                  className={`text-bold easein-out
                                              text-[1rem]
                                              m-2
                                              transform 
                                              border-2
                                              border-white 
                                              bg-red-600 
                                              px-4 py-2
                                              leading-none text-white transition duration-100
                                              hover:-translate-y-1
                                              hover:scale-110
                                              hover:border-red-200
                                              hover:bg-white
                                              hover:text-red-600
                                              hover:shadow-[0_0.5em_0.5em_-0.4em_#ffa260]
                                              rounded-lg
                                              content-center`}
                                  onClick={async () => {
                                    // Update the passenger status to checked
                                    // updateStatusToChecked({bookingId: passenger.id});
                                    setIsUpdated(true);
                                  } 
                              }     
                            >
                                Confirmer votre participation
                            </Button>
                            )
                            : (
                              <div className="bg-gray-200 p-2 rounded-lg m-2 bg-green-700 ">
                                  <p className="text-[1rem] text-white leading-2">
                                      Passager prêt
                                  </p>
                              </div>
                            )}
                            </>
                          ) : (
                            <>
                              {passenger.status !== BookingStatus.CHECKED ? (
                                <div className="bg-gray-200 p-2 rounded-lg m-2 bg-red-600">
                                  <p className="text-[1rem] text-white leading-2">
                                      Passager non prêt
                                  </p>
                              </div>
                            )
                            : (
                              <div className="p-2 rounded-lg m-2 bg-green-700 ">
                                  <p className="text-[1rem] text-white leading-2">
                                      Passager prêt
                                  </p>
                              </div>
                            )}
                            </>
                          )}
                      </div>
                  </div>
              ))}
            </div>
            <div className="mt-8">
              <Map zoom={12} onMapLoad={async () => {
                  // setIsMapLoaded(true);
              }} />
            </div>
          </div>
        </div>
      </LayoutMain>
  );
}
