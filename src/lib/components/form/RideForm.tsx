/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Autocomplete from "react-google-autocomplete";
import DateTimeSelect from "./DateTimeSelect";
import Button from "$/lib/components/button/Button";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useApiKey } from "$/context/apiContext";
import MuiStyle from "$/styles/MuiStyle.module.css";
import { RideStatus, RideType, type Ride } from "@prisma/client";
import Slider from "$/lib/components/button/Slider";
import Dropdown from "../dropdown/Dropdown";
import {
  data,
  getCampusAddressWithAbbr,
  getCampusLatLng,
} from "$/utils/data/school";
import Infos from "$/lib/components/button/Infos";
import { loadGooglePlacesApi } from "$/context/asyncLoadApiContext";

export default function RideForm({
  ride,
  isForGroup,
  groupId,
}: {
  ride?: Ride;
  isForGroup?: boolean;
  groupId?: number;
}) {
  const { data: sessionData } = useSession();
  const apiKey = useApiKey();
  const google = loadGooglePlacesApi();

  useEffect(() => {
    if (google === undefined) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }else{
      console.log({ google });
    }
  }, [apiKey]);
  // Address of departure and destination from google autocomplete
  const address: {
    departure: google.maps.places.PlaceResult | null;
    destination: google.maps.places.PlaceResult | null;
  } = {
    departure: null,
    destination: null,
  };
  const [departure, setDeparture] = useState<string>();
  const [destination, setDestination] = useState<string>();

  // Date of ride
  const [dateDeparture, setDateDeparture] = useState<Dayjs | null>(
    ride?.departureDateTime ? dayjs(ride.departureDateTime) : null,
  );

  // Time of departure and destination
  const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>();
  // Is a return ride ?
  const [isRideReturn, setisRideReturn] = useState<boolean>(
    ride?.type === RideType.RETOUR ? true : false,
  );
  // If return
  const [timeReturn, setTimeReturn] = useState<Dayjs | null>(
    ride?.returnTime ? dayjs(ride.returnTime) : null,
  );

  const [arrivalTime, setArrivalTime] = useState<Dayjs | null>(ride?.arrivalDateTime ? dayjs(ride?.arrivalDateTime) : null);
  

  // Latitude and longitude of departure and destination
  const [departureLatitude, setDepartureLatitude] = useState<number>();
  const [departureLongitude, setDepartureLongitude] = useState<number>();
  const [destinationLatitude, setDestinationLatitude] = useState<number>();
  const [destinationLongitude, setDestinationLongitude] = useState<number>();

  // School & campus state
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  // Verify if the school is in dropdown
  const [schoolInDropdown, setSchoolInDropdown] = useState<boolean>(true);

  // Maximum number of booking
  const [maxBooking, setMaxBooking] = useState<number>(
    ride?.maxPassengers ?? 2,
  );

  // Maximum distance to pick up a passenger
  const [maxDistance, setMaxDistance] = useState<number>(
    ride?.maxDetourDist ?? 10,
  );

  // Options for autocomplete
  const options = {
    componentRestrictions: { country: "be" },
    strictBounds: false,
    types: ["address"],
  };

  // Create a new ride
  const { data: rideCreated, mutate: createride } =
    api.ride.create.useMutation();
  // Used to update ride
  const { data: updatedride, mutate: updateride } =
    api.ride.update.useMutation();

  /* _______________ USEFFECT FOR SET UP DATE & TIME DEPARTURE WHEN CREATING OR UPDATING A RIDE _______________ */
  useEffect(() => {
    if (dateDeparture) {
      // if the user has selected a time for the departure date
      if (timeDeparture) {
        // CREATING A RIDE: set the date of departure with the time selected
        setDateDeparture(
          dayjs(dateDeparture)
            .set("hour", timeDeparture.hour())
            .set("minute", timeDeparture.minute()),
        );
      } else {
        // UPDATING A RIDE: else set the date of departure with the time of the ride
        setDateDeparture(
          dayjs(dateDeparture)
            .set("hour", ride?.departureDateTime?.getHours() ?? 0)
            .set("minute", ride?.departureDateTime?.getMinutes() ?? 0),
        );
      }
    }
  }, [dateDeparture, timeDeparture, ride]);

  /* _______________________ USEFFECT FOR CHECK IF RIDE IS PRESENT & SET MAXBOOKING + MAXDETOURDIST ________________________ */
  useEffect(() => {
    if (ride) {
      setMaxBooking(maxBooking ?? ride.maxPassengers);
      setMaxDistance(maxDistance ?? ride.maxDetourDist);
    }
  }, [ride, maxBooking, maxDistance]);

  /* _______________________ USEFFECT FOR CHECK & SET THE TIME IF THE TYPE OF RIDE IS ALLER-RETOUR _________________________ */
  useEffect(() => {
    if (isRideReturn) {
      // if the user has selected ALLER-RETOUR
      // Get the time
      if (timeReturn) {
        // Set dateReturn with (dateDeparture & timeReturn) because application is school based
        setTimeReturn(
          dayjs(dateDeparture)
            .set("hour", timeReturn.hour())
            .set("minute", timeReturn.minute()),
        );
      }
      return;
    }
  }, [timeReturn, dateDeparture]);

  /* _______________________ USEFFECT FOR TEST & REDIRECT WHEN CREATING/UPDATING A RIDE _________________________ */
  useEffect(() => {
    if (rideCreated ?? updatedride) {
      window.location.href = `/rides/${rideCreated?.id ?? updatedride?.id}`;
    }
  }, [rideCreated, updatedride]);

  // Submit a new ride or update an existing ride
  function handleClick() {
    if (sessionData) {
      // ------------------- Create ride -------------------
      if (!ride) {
        if (!isRideReturn && timeReturn) {
          if (
            timeReturn?.isBefore(timeDeparture) ||
            (timeReturn?.diff(timeDeparture, "hour") ?? 0) < 2
          ) {
            alert(
              "L'heure de retour doit au moins 2h après l'heure de départ",
            );
          }
        }

        if (departure && destination) {
          // Check if the date of return is after the date of departure
          if (dateDeparture && arrivalTime && dateDeparture.isBefore(arrivalTime)) {
            // Check if the time of return is after the time of departure and at least 2 hours after
            createride({
              driverId: sessionData.user.id,
              departure: departure,
              departureLatitude: departureLatitude ?? 0,
              departureLongitude: departureLongitude ?? 0,
              departureDateTime: dateDeparture.toDate(),
              arrivalDateTime: arrivalTime.toDate(),
              destination: destination,
              destinationLatitude: destinationLatitude ?? 0,
              destinationLongitude: destinationLongitude ?? 0,
              returnTime: timeReturn?.toDate() ?? null,
              maxBookings: maxBooking ?? 2,
              maxDetour: maxDistance ?? 10,
              type: isRideReturn ? "RETOUR" : "ALLER",
              isForGroup: isForGroup ?? false,
              groupId: groupId ?? null,
            });
          }
        } else {
          alert(
            "An error occurred while creating the ride, please check the form and try again.",
          );
          return;
        }
      }
      // ------------------- Update ride -------------------
      if (ride) {
        if (
          timeReturn?.isBefore(timeDeparture) &&
          (timeReturn?.diff(timeDeparture, "hour") ?? 0) < 2
        ) {
          alert(
            "L'heure de retour doit au moins 2h après l'heure de départ",
          );
        } else {
          const tmpTimeReturn = timeReturn ? timeReturn.toDate() : null;
          updateride({
            id: ride.id,
            driverId: ride.driverId,
            departure: departure ?? ride.departure,
            departureLatitude: departureLatitude ?? ride.departureLatitude,
            departureLongitude: departureLongitude ?? ride.departureLongitude,
            departureDateTime:
              dateDeparture?.toDate() ?? ride.departureDateTime,
            arrivalDateTime: arrivalTime?.toDate() ?? ride.arrivalDateTime,
            destination: destination ?? ride.destination,
            destinationLatitude:
              destinationLatitude ?? ride.destinationLatitude,
            destinationLongitude:
              destinationLongitude ?? ride.destinationLongitude,
            returnTime: tmpTimeReturn ?? ride.returnTime,
            maxBookings: maxBooking ?? ride.maxPassengers,
            maxDistance: maxDistance ?? ride.maxDetourDist,
            type: isRideReturn ? "RETOUR" : "ALLER",
            status: dateDeparture?.isSame(dayjs())
              ? RideStatus.IN_PROGRESS_FORTH
              : ride.status,
          });
        }
      }
    }
  }

  // Used to defines is the ride is simple or return isRideReturn const
  const handleCheck = () => {
    if (isRideReturn) {
      setisRideReturn(false);
    } else {
      setisRideReturn(true);
    }
    console.log("Is a simple ride ? ", isRideReturn);
  };

  return (
    <>
      <div className="m-auto flex w-auto flex-col items-center justify-center bg-[var(--purple-g3)]">
        {/* First step of the form -> Departure & Destination */}
        <div className="my-8 border-2 border-[var(--purple-g1)]">
          {/* Set up departure */}
          <div className=" m-2 flex flex-col border-b-2 border-[var(--pink-g1)] p-2 sm:flex-row sm:items-center">
            <label
              htmlFor="departure"
              className="mb-1 mr-4 text-xl text-[var(--pink-g1)] md:text-2xl"
            >
              D'où partez-vous ?
            </label>
            <Autocomplete
              defaultValue={ride?.departure ?? ""}
              apiKey={apiKey}
              options={options}
              onPlaceSelected={(place) => {
                address.departure = place;
                setDeparture(address.departure.formatted_address);
                if (
                  address.departure.geometry?.location?.lat() &&
                  address.departure.geometry?.location?.lng()
                ) {
                  setDepartureLatitude(
                    address.departure.geometry.location.lat(),
                  );
                  setDepartureLongitude(
                    address.departure.geometry.location.lng(),
                  );
                }
              }}
              className=" 
                my-2 
                w-[75%] 
                border-2
                border-[var(--purple-g1)] bg-[var(--purple-g3)]
                p-2
                text-xl
                text-white 
                md:w-[75%] md:text-2xl"
              id="departure"
            />
          </div>
          {/* Set up destination */}
          <div className="m-1 flex flex-col border-b-2 border-[var(--pink-g1)] p-2">
            {/* Input & Dropdown to select school */}
            <div className="m-0 p-2 ">
              <p className="text-[1.25rem] text-[var(--pink-g1)]">
                Où vous rendez-vous ?
              </p>
              {schoolInDropdown ? (
                <Dropdown
                  data={data}
                  styleDropdown="w-full my-2 text-[1.25rem] md:text-2xl 
                                                       text-white bg-[var(--purple-g3)] p-2"
                  colorLabel="text-[var(--pink-g1)]"
                  onChange={(
                    sc: ChangeEvent<HTMLSelectElement>,
                    ca: ChangeEvent<HTMLSelectElement>,
                  ) => {
                    setSelectedSchool(sc.target.value);
                    setSelectedCampus(ca.target.value);
                    if (ca.target.value) {
                      const campusAddress = getCampusAddressWithAbbr(
                        ca.target.value,
                      );
                      if (campusAddress) {
                        setDestination(campusAddress);
                      }
                      setDestinationLatitude(
                        getCampusLatLng(ca.target.value).lat,
                      );
                      setDestinationLongitude(
                        getCampusLatLng(ca.target.value).lng,
                      );
                    }
                  }}
                />
              ) : (
                <>
                  <div className="mt-2 p-2">
                    <p className="text-gray-400 md:text-2xl"></p>
                    <label
                      htmlFor="destination"
                      className="mb-1 
                                mr-2 
                                text-[1.25rem] 
                                text-[var(--pink-g1)] md:text-2xl"
                    >
                      Entrez l'adresse
                    </label>
                    <Autocomplete
                      defaultValue={ride?.destination ?? ""}
                      disabled={false}
                      apiKey={apiKey}
                      options={options}
                      onPlaceSelected={(place) => {
                        address.destination = place;
                        setDestination(address.destination.formatted_address);
                        if (
                          address.destination.geometry?.location?.lat() &&
                          address.destination.geometry?.location?.lng()
                        ) {
                          setDestinationLatitude(
                            address.destination.geometry.location.lat(),
                          );
                          setDestinationLongitude(
                            address.destination.geometry.location.lng(),
                          );
                        }
                      }}
                      className=" 
                        my-2 
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
                </>
              )}
              {schoolInDropdown ? (
                <>
                  <Button
                    className="cursor-pointer border-gray-600 hover:border-b-2"
                    onClick={() => setSchoolInDropdown(false)}
                  >
                    Vous ne trouvez pas le vôtre ?
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="cursor-pointer border-gray-600 hover:border-b-2"
                    onClick={() => setSchoolInDropdown(true)}
                  >
                    Retourner à la liste
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* Set up date & time */}
          <div className="m-2 flex flex-col border-b-2 border-[var(--pink-g1)] p-2">
            <div className="mb-2 flex cursor-pointer flex-row items-center">
              <label
                htmlFor="destination"
                className="mb-1 mr-4 text-xl text-[var(--pink-g1)] md:text-2xl"
              >
                Quand partez-vous ?
              </label>
              {/* ---------------------------------------------- Icon infos -------------------------------------------- */}
              <Infos
                wIcon={25}
                hIcon={25}
                handleInfos={() =>
                  alert(
                    "Attention : L'heure que vous entrez correspondra à l'heure où vous devrez avoir ramassé le dernier passager \n" +
                      "L'heure réelle de démarrage sera calculée en fonction des passagers et de la distance à parcourir jusque l'établissement.",
                  )
                }
              />
              {/* ------------------------------------------------------------------------------------------------- */}
            </div>
            <DateTimeSelect
              defaultDate={
                ride?.departureDateTime?.toDateString()
                  ? dayjs(ride.departureDateTime?.toDateString())
                  : null
              }
              defaultTime={
                ride?.departureDateTime?.toDateString()
                  ? dayjs(ride?.departureDateTime)
                      .set("hour", ride?.departureDateTime?.getHours())
                      .set("minute", ride?.departureDateTime?.getMinutes())
                  : null
              }
              labelexpTime="H. DE DEPART"
              labelexp="DATE DE DEPART"
              disableDate={false}
              disableTime={false}
              handleChangeDate={(date) => {
                setDateDeparture(date);
              }}
              handleChangeTime={(time) => {
                setTimeDeparture(time);
              }}
              justTime={false}
            />
          </div>
          {/* Defines maximum number of booking */}
          <div className="my-4 ml-4 w-[90%] border-b-2 border-[var(--pink-g1)] pb-4">
            <div className="mb-3 flex flex-row items-center text-[1.25rem] text-[var(--pink-g1)]">
              Combien avez-vous de places disponibles ?
              <p className="ml-4 rounded-full border-2 bg-white p-1 text-gray-600">
                {maxBooking ?? ride?.maxPassengers}
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              value={maxBooking}
              className="ds-range ds-range-primary"
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                setMaxBooking(e.target.valueAsNumber);
              }}
            />
          </div>
          {/* <div className="my-4 ml-4 w-[90%] border-b-2 border-[var(--pink-g1)] pb-4">
            <div className="mb-3 flex flex-row items-center text-[1.25rem] text-[var(--pink-g1)]">
              Quel distance êtes-vous prêt à parcourir pour aller chercher un
              passager ?
               ---------------------------------------------- Icon infos -------------------------------------------- 
              <Infos
                wIcon={25}
                hIcon={25}
                handleInfos={() =>
                  alert(
                    "Attention : La distance affichée correspond à la distance que vous acceptez de parcourir pour UN passager. \n" +
                      "Il est primordial que vous puissiez respecter votre engagement auprès de vos passagers. Veillez donc à sélectionner \n" +
                      "une distance qui vous convient ! Noter que la distance est en 'kilomètres (Kms)' \n" +
                      "Les utilisateurs qui rentrent dans les conditions pourront souscrire directement à votre trajet.",
                  )
                }
              />
               ------------------------------------------------------------------------------------------------- 
              <p className="ml-4 rounded-full border-2 bg-white p-1 text-center text-[1.25rem] text-gray-600">
                {maxDistance}
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={70}
              value={maxDistance}
              className="ds-range ds-range-accent"
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                setMaxDistance(e.target.valueAsNumber);
              }}
            />
          </div> */}
          <div>
              <div className="relative left-2 mx-2 w-[90%] border-2 border-[var(--pink-g1)] p-2 border-b-2 border-[var(--pink-g1)] mb-4">
                <p className="m-2 text-[20px] text-white">
                  A quelle heure devez-vous être en cours ?
                </p>
                <DateTimeSelect
                  defaultDate={
                    ride?.arrivalDateTime.toDateString()
                      ? dayjs(ride.arrivalDateTime.toDateString())
                      : dateDeparture
                  }
                  defaultTime={
                    ride?.arrivalDateTime?.toDateString()
                      ? dayjs(ride?.departureDateTime)
                          .set("hour", ride?.arrivalDateTime?.getHours())
                          .set("minute", ride?.arrivalDateTime?.getMinutes())
                      : null
                  }
                  labelexpTime="H. D'ARRIVEE"
                  labelexp="HEURE D'ARRIVEE"
                  disableDate={false}
                  disableTime={false}
                  handleChangeDate={() => {
                    console.log("No date to set for return time");
                  }}
                  handleChangeTime={(time) => {
                    setArrivalTime(time);
                  }}
                  justTime={true}
                />
              </div>
            </div>
        </div>
        {/* Defines if the ride is a simple or return */}
        <div className="col-span-1 mb-4 ">
          <div className="mt-2!important mb-2 flex flex-col items-center justify-center px-4 py-2 text-base text-white">
            <label
              htmlFor="SliderDsiplay"
              className="relative top-1 mx-2 text-[1.25rem] md:text-2xl"
            >
              Voulez-vous planifier le retour ?
            </label>
            <div className="mt-5 flex flex-col items-center">
              <Slider check={handleCheck} checked={isRideReturn} />
              <p className="mt-2">
                {isRideReturn
                  ? "Oui je le souhaite !"
                  : "Non merci, peut-être plus tard"}
              </p>
            </div>
          </div>
        </div>
        {isRideReturn && (
          <>
            {/* Set up the return Time if ALLER-RETOUR (normally the last step of the form) */}
            <div className="mx-2 w-[90%] border-2 border-[var(--pink-g1)] p-2">
              <p className="m-2 text-[20px] text-white">
                A quelle heure démarrez-vous pour rentrez à votre domicile ?
              </p>
              <DateTimeSelect
                defaultDate={
                  ride?.returnTime?.toDateString()
                    ? dayjs(ride.returnTime.toDateString())
                    : dateDeparture
                }
                defaultTime={
                  ride?.returnTime?.toDateString()
                    ? dayjs(ride?.departureDateTime)
                        .set("hour", ride?.returnTime?.getHours())
                        .set("minute", ride?.returnTime?.getMinutes())
                    : null
                }
                labelexpTime="H. DE DEPART"
                labelexp="DATE DE DEPART"
                disableDate={false}
                disableTime={false}
                handleChangeDate={() => {
                  console.log("No date to set for return time");
                }}
                handleChangeTime={(time) => {
                  setTimeReturn(time);
                }}
                justTime={true}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center">
        {/* Submit */}
        {ride ? (
          <Button
            type="submit"
            className={`${MuiStyle.MuiButtonText} w-max`}
            onClick={handleClick}
          >
            {" "}
            Enregistrer les modifications{" "}
          </Button>
        ) : (
          <Button
            type="submit"
            className={`${MuiStyle.MuiButtonText} w-max`}
            onClick={handleClick}
          >
            {" "}
            Publier le trajet{" "}
          </Button>
        )}
        <Button
          className="w-max rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
          onClick={() =>
            ride
              ? location.assign(`/rides/${ride?.id}`)
              : location.assign("/rides/")
          }
        >
          Annuler
        </Button>
      </div>
    </>
  );
}
