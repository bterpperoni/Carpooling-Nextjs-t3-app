/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import LayoutMain from "../../lib/components/layout/LayoutMain";
import Map from "$/lib/components/map/Map";
import Slider from "$/lib/components/button/Slider";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import { Marker } from "@react-google-maps/api";
import RideCard from "$/lib/components/containers/RideCard";
import { useRouter } from "next/router";
import Button from "$/lib/components/button/Button";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display all rides -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
const AllRides: React.FC = () => {
  // Map settings
  const center: google.maps.LatLngLiteral = { lat: 50.463727, lng: 3.938247 };
  const zoom = 12;
  const mapRef = useRef<google.maps.Map | null>(null);
  // Session recovery
  const { data: sessionData } = useSession();
  // Router
  const router = useRouter();

  // Redirect to ride page when clicking on a marker or a card ride
  const handleClick = (id: number) => {
    void router.push(`/rides/${id}`);
  };

  // Get all rides
  const { data: rideList } = api.ride.rideList.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const customMarker = {
    // Refer to https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-custom
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillOpacity: 1,
    scale: 2,
    strokeWeight: 2,
  };

  // Used to display the list of rides or the map
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  // Set the map ref when it's loaded
  async function mapLoaded(map: google.maps.Map) {
    mapRef.current = map;
  }

  useEffect(() => {
    if(mapRef && mapRef.current === null){
      void mapLoaded;
      return;
    } 
  }, [mapRef, checked]);

  return (
    <>
      <LayoutMain>
        <div className="bg-[var(--purple-g3)]">
          <div className="mt-2 flex flex-col items-center">
            <div className="border-b-t-2 border-0 border-white">
              <div
                className="mx-12 mb-4 rounded-[5%] border-y-2 border-fuchsia-700 
                                                    bg-[var(--purple-g3)] p-4 text-center text-xl text-fuchsia-700 md:text-2xl"
              >
                <p>Trouver un trajet</p>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <p className="m-4 rounded-full border-2 border-white px-4 py-2 text-base text-white">
                  <label htmlFor="SliderDsiplay" className="mx-2">
                    Type d'affichage : {checked ? "Liste" : "Carte"}
                  </label>
                  <Slider check={handleCheck} checked={checked} />
                </p>
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
              <select className="rounded-md border px-3 py-2">
                <option value="all">Tout</option>
                <option value="active">Destinations</option>
                <option value="inactive">Autres</option>
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
          {checked && (
            <>
              <div className="h-box m-6 w-auto border-fuchsia-700 bg-white text-fuchsia-700">
                {rideList?.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    driver={ride.driverId}
                    goToRide={() => handleClick(ride.id)}
                  />
                ))}
              </div>
            </>
          )}
          {/* -------------------------------------- display map ---------------------------------------------- */}
          {!checked && (
            <>
              <Map center={center} zoom={zoom} onLoad={mapLoaded} children={rideList?.map((ride, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: ride.departureLatitude,
                      lng: ride.departureLongitude,
                    }}
                    onClick={() => handleClick(ride.id)}
                    icon={customMarker}
                  />
                ))}>
              </Map>
            </>
          )}
        </div>
      </LayoutMain>
    </>
  );
};

export default AllRides;
