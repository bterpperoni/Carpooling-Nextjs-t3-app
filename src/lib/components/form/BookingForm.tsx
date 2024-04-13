/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useApiKey } from "$/context/api";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { useEffect, useState } from "react";
import Button from "$/lib/components/button/Button";
import { calculateDistance } from "$/hook/distanceMatrix";
import type { Booking, Ride } from "@prisma/client";
import { Loader } from '@googlemaps/js-api-loader';


export default function BookingForm({ ride, booking }: 
    { 
        ride: Ride | undefined, 
        booking?: Booking
    }) {
  // ________________________________ STATE ________________________________
  const apiKey = useApiKey();
  // Get id from url
  const { query, push } = useRouter();
  // Session recovery
  const { data: sessionData } = useSession();

  const rideIdQuery = query.ride as string;
  //  Max distance driver can go to pick up passenger
  const maxDistanceDetour = ride?.maxDetourDist ?? 0;
  // Distance in kilometers between driver departure and passenger destination
  const [distanceInKilometersA, setDistanceInKilometersA] = useState<number>(0);
  // Distance in kilometers between passenger pickup point and destination
  const [distanceInKilometersB, setDistanceInKilometersB] = useState<number>(0);
  // Price of ride
  const [priceRide, setPriceRide] = useState<string>();

  // Is booking eligible
  const [bookingEligible, setBookingEligible] = useState<boolean>(false);
  // Address of departure (got from 'ride' object)
  const origin = ride?.departure ?? "";
  // Address of destination (got from 'ride' object)
  const destination = ride?.destination ?? "";
  // Address of pickup point (got from booking object)
  const destPickup = booking?.pickupPoint ?? "";
  // Address of pickup point + Latitude and Longitude (got from Autocomplete)
  const [destinationBooking, setDestinationBooking] = useState<string | null>(null);
  const [destinationLatitude, setDestinationLatitude] = useState<number| null>(null);
  const [destinationLongitude, setDestinationLongitude] = useState<number| null>(null);
  // Price for fuel per kilometer
  const fuelPrice = 0.1;

  // Options for autocomplete
  const options = {
    componentRestrictions: { country: "be" },
    strictBounds: false,
    types: ["address"],
  };
    
  // Create new booking
  const { data: bookingCreated, mutate: createBooking } =
    api.booking.create.useMutation();
  // Update booking
  const { data: bookingUpdated, mutate: updateBooking } =
    api.booking.update.useMutation();

  // Redirect to ride page when booking is created
  useEffect(() => {
    if (bookingCreated ?? bookingUpdated) {
      location.assign(`/rides/${ride?.id}/bookings/${bookingCreated?.id ?? bookingUpdated?.id}`);
    }
  }, [bookingCreated, bookingUpdated]);

  // ________________________________ STATE TO MANAGE ELIGIBILITY & PRICE FOR PASSENGER ________________________________
  useEffect(() => {
    async function getDistanceAndCheckEligibility() {
      /* ----DISTANCE A--- */
      const distanceInMetersEligibility = await calculateDistance(
        origin,
        destinationBooking ?? destPickup,
      );
      const distanceEligibility = parseInt(distanceInMetersEligibility) / 1000;
      setDistanceInKilometersA(distanceEligibility);
      /* ----DISTANCE B--- */
      const distanceInMetersForTotal = await calculateDistance(
        destinationBooking ?? destPickup,
        destination,
      );
      const distanceRest = parseInt(distanceInMetersForTotal) / 1000;
      setDistanceInKilometersB(distanceRest);
      /* ----------------- */
      if (distanceInKilometersA <= maxDistanceDetour) {
        setBookingEligible(true);
        const tmpPrice =
          (distanceInKilometersA + distanceInKilometersB) * fuelPrice;
        setPriceRide(tmpPrice.toFixed(2));
      } else {
        setBookingEligible(false);
        return;
      }
    }

    if (origin && (destinationBooking ?? destPickup)) {
      void getDistanceAndCheckEligibility();
    }
  }, [
    destinationBooking,
    destPickup,
    origin,
    distanceInKilometersA,
    distanceInKilometersB,
    priceRide,
  ]);

  // When click on submit button
  function handleClick() {
    if (sessionData) {
      if(booking) {
        // ------------------- Update booking -------------------
        updateBooking({
          id: booking.id,
          rideId: ride?.id ?? 0,
          userName: sessionData.user.name,
          pickupPoint: destinationBooking ?? destPickup,
          pickupLatitude: destinationLatitude ?? booking.pickupLatitude,
          pickupLongitude: destinationLongitude ?? booking.pickupLongitude,
          price: priceRide?.toString() ?? booking.price,
          status: "UPDATED",
        });
      }else {
        // ------------------- Create booking -------------------
        createBooking({
          rideId: ride?.id ?? 0,
          userName: sessionData.user.name,
          pickupPoint: destinationBooking ?? '',
          pickupLatitude: destinationLatitude ?? 0,
          pickupLongitude: destinationLongitude ?? 0,
          price: priceRide?.toString() ?? "0",
          status: "CREATED",
        });
      }
    }
  }

  // ________________________________ RENDER ________________________________
  return (
    <>
      <div className="mt-2 flex w-[90vw] flex-col p-2 md:flex-row">
        <p className="text-gray-400 md:text-2xl"></p>
        <label
          htmlFor="destination"
          className=" mb-1 
                      mr-2 
                      text-[1.25rem] 
                      text-[var(--pink-g1)] md:text-2xl">
          Où souhaitez vous que {ride?.driverId} vous récupère ?
        </label>
        {/* This autocomplete will be used as destination to calcul distance from driver departure to this address */}
        <Autocomplete
          defaultValue={booking?.pickupPoint ?? ""}
          apiKey={apiKey}
          options={options}
          onPlaceSelected={async (place) => {
            setDestinationBooking(place.formatted_address ?? "");
            if (
              place.geometry?.location?.lat() &&
              place.geometry?.location?.lng()
            ) {
              setDestinationLatitude(place.geometry.location.lat());
              setDestinationLongitude(place.geometry.location.lng());
            }
          }}
          className="my-2 
                    w-[75%] 
                    border-2
                    border-[var(--purple-g1)] bg-[var(--purple-g3)]
                    p-2
                    text-xl 
                    text-white 
                    md:w-[75%] md:text-2xl"
          id="destination"
        />
      </div>
      <div className="m-1 mt-5 flex w-[90vw] flex-col border-t-2 border-[var(--pink-g1)] p-2">
        <div className="text-xl text-white">
          <p>
            Départ :
            <span className="text-[var(--pink-g1)]"> {ride?.departure}</span>
          </p>
          <p>
            Addresse du point de passage :
            <span className="text-[var(--pink-g1)]">
              {" "}
              {(destinationBooking ?? destPickup) ? destinationBooking ?? destPickup : "Aucune addresse n'a été saisie"}
            </span>
          </p>
        </div>
      </div>
      {(destinationBooking ?? destPickup) && (
        <>
          <div className="mt-5 flex w-[90vw] flex-col border-y-2 border-[var(--pink-g1)] p-2">
            <div className="text-xl text-white">
              <p>
                Départ - Pt. passage:
                <span className="text-[var(--pink-g1)]">
                  {" "}
                  {distanceInKilometersA} km
                </span>
              </p>
              <p>
              Pt. passage - Destination:
                <span className="text-[var(--pink-g1)]">
                  {" "}
                  {distanceInKilometersB} km
                </span>
              </p>
              <p>
                Êtes-vous éligible à la réservation ?
                <span className="text-[var(--pink-g1)]">
                  {bookingEligible ? " Oui" : " Non"}
                </span>
              </p>
              {bookingEligible && (
                <>
                  <p>
                    Prix estimé du trajet :
                    <span className="text-[var(--pink-g1)]">
                      ~ {priceRide} €
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
          {bookingEligible && (
            <>
              <div className="m-4 mt-6 flex w-full flex-row items-center justify-around">
                {booking ? (
                  <>
                    <Button
                      onClick={handleClick}
                      className="col-span-1 w-max rounded-full border-2 
                                 border-[var(--pink-g1)] bg-[var(--purple-g3)] px-3 py-2 text-base text-white hover:bg-[var(--pink-g1)]"
                      >
                      Modifier la réservation
                    </Button> 
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleClick}
                      className="col-span-1 w-max rounded-full border-2 
                                 border-[var(--pink-g1)] bg-[var(--purple-g3)] px-3 py-2 text-base text-white hover:bg-[var(--pink-g1)]"
                    >
                      Confirmer la réservation
                    </Button> 
                  </>
                )}
              </div>
            </>
          )}

        </>
      )}
      <Button
        className="h-10 w-24 rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600 my-4"
        onClick={() =>
          booking ? location.assign(`/rides/${ride?.id}/bookings/${booking?.id}`) : location.assign(`/rides/${ride?.id}/`)
        }>
        Annuler
      </Button>
    </>
  );
}
