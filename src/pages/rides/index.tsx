/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import LayoutMain from "$/lib/components/layout/LayoutMain";
import Map from "$/lib/components/map/Map";
import Slider from "$/lib/components/button/Slider";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import RideCard from "$/lib/components/containers/rides/RideCard";
import Button from "$/lib/components/button/Button";
import { useMap } from "$/context/mapContext";
import Loader from "$/lib/components/error/Loader";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display all rides -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
const AllRides: React.FC = () => {
  // Map settings
  const center = { lat: 50.463727, lng: 3.938247 };

  const [isPending, startTransition] = useTransition();

  // Session recovery
  const { data: sessionData } = useSession();



  // Redirect to ride page when clicking on a marker or a card ride
  const handleClick = (id: number) => {
    window.location.assign(`/rides/${id}`);
  };

  // Get all rides
  const { data: rideList } = api.ride.rideList.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  // Get user by id
  const { data: userAddress } = api.user.userAddressById.useQuery({ id: sessionData?.user.id ?? "" }, { enabled: sessionData?.user !== undefined });

  const userLocation: { lat: number | undefined | null, lng: number | undefined | null } = { lat: userAddress?.addressLatitude, lng: userAddress?.addressLongitude };
  const [filterValue, setFilterValue] = useState("departure");

  // Used to display the list of rides or the map
  const [checked, setChecked] = useState(true);

  const handleCheck = () => {
    setChecked(!checked);
  };

  // Access the map object
  const mapRef = useMap();

  useEffect(() => {
    if (userAddress?.address == null && sessionData?.user.name !== undefined) {
      window.location.assign(`/users/${sessionData.user.name}`);
    }
  }, [userAddress]);

  if (sessionData) {
    return (
      <LayoutMain>
        {isPending ? (
          <Loader />
        ) : (
          <>
            <div className="bg-[var(--purple-g3)]">
              <div className="mt-2 flex flex-col items-center">
                <div className="border-b-t-2 flex flex-row border-0 border-white">
                  <div
                    className="mx-12 mb-4 rounded-[5%] border-y-2 border-fuchsia-700 
                             bg-[var(--pink-g1)] p-4 text-center text-xl text-white md:text-2xl"
                  >
                    <p>Trouver un trajet</p>
                  </div>
                  <div className="bg-[var(--purple-g3)] rounded-full col-span-1 p-1  right-1 w-max bottom-5 fixed  flex items-center justify-center">
                    <Slider textLbl={checked ? "Carte" : "Liste"} check={handleCheck} checked={checked} />
                  </div>
                </div>
              </div>
            </div>
            <div className="block flex-col">
              <div className="m-2 grid grid-flow-col grid-cols-2 items-center justify-items-center gap-12">
                <div className="col-span-1 ml-6">
                  <span className="mr-2 text-sm text-xl text-fuchsia-700">
                    Filtres
                  </span>
                  <select value={filterValue} className="rounded-md border px-3 py-2" onChange={(option) => {
                    setFilterValue(option.target.value);
                  }}>
                    <option value="destinations">Destinations</option>
                    <option value="departure">Départs</option>
                  </select>
                </div>
                <Button
                  onClick={() => (window.location.href = "/rides/create")}
                  className="col-span-1 w-max rounded-full border-2 
                          border-[var(--pink-g1)] bg-[var(--purple-g3)] px-3 py-2 text-base text-white hover:bg-[var(--pink-g1)]"
                >
                  Proposer un trajet
                </Button>
              </div>
              {/* ------------------------------------- display list --------------------------------------------- */}
              {!checked && (
                <>
                  <div className="h-box my-4 w-auto border-fuchsia-700 bg-white text-fuchsia-700">
                    {
                      rideList?.map((ride) => (
                        <RideCard
                          key={ride.id}
                          ride={ride}
                          driver={ride.driver.name}
                          driverImg={ride.driver.image ?? "/avatar.png"}
                          goToRide={() => startTransition(() => handleClick(ride.id))}
                        />
                      ))}
                  </div>
                </>
              )}
              {/* -------------------------------------- display map ---------------------------------------------- */}
              {(checked && !isPending) && (
                <>
                  <Map
                    center={center}
                    onMapLoad={() => {
                      // The marker, positioned at
                      if (userLocation) {
                        new google.maps.Marker({
                          position: {
                            lat: userLocation?.lat ?? 0,
                            lng: userLocation?.lng ?? 0,
                          },
                          map: mapRef.current,
                          icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "blue",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "black",
                          },
                          title: "Votre position",
                          clickable: false,
                        });
                        new google.maps.Marker({
                          position: {
                            lat: userLocation?.lat ?? 0,
                            lng: userLocation?.lng ?? 0,
                          },
                          map: mapRef.current,
                          icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 14,
                            fillColor: "blue",
                            fillOpacity: 0.5,
                            strokeWeight: 2,
                            strokeColor: "black"
                          },
                          title: "Votre position",
                          clickable: false
                        });
                      }
                      rideList?.map((ride) => {
                        if (filterValue === "departure") {
                          const marker = new google.maps.Marker({
                            position: { lat: ride.departureLatitude, lng: ride.departureLongitude },
                            map: mapRef.current,
                            icon: {
                              path: window.google.maps.SymbolPath.CIRCLE,
                              scale: 12,
                              fillColor: "yellow",
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "black"
                            },
                            title: `${ride.driver.name} - Départ : ${ride.departure}`,
                            clickable: true
                          });
                          marker.addListener("click", () => startTransition(() => handleClick(ride.id)));
                          mapRef.current?.setZoom(9);
                        } else if (filterValue === "destinations") {
                          const marker = new google.maps.Marker({
                            position: { lat: ride.destinationLatitude, lng: ride.destinationLongitude },
                            map: mapRef.current,
                            icon: {
                              path: window.google.maps.SymbolPath.CIRCLE,
                              scale: 12,
                              fillColor: "green",
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "black"
                            },
                            title: `${ride.driver.name} - Destination : ${ride.destination}`,
                            clickable: true
                          });
                          marker.addListener("click", () => startTransition(() => handleClick(ride.id)));
                          mapRef.current?.setZoom(12);
                        }

                      });
                    }}
                  >
                  </Map>
                </>
              )}
            </div>
          </>
        )}
      </LayoutMain>
    );
  }
};
export default AllRides;
