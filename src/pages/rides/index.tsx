/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import LayoutMain from "$/lib/components/layout/LayoutMain";
import Map from "$/lib/components/map/Map";
import Slider from "$/lib/components/button/Slider";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import RideCard from "$/lib/components/containers/rides/RideCard";
import { useRouter } from "next/router";
import Button from "$/lib/components/button/Button";
import { useMap } from "$/context/mapContext";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display all rides -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
const AllRides: React.FC = () => {
  // Map settings
  const center = { lat: 50.463727, lng: 3.938247 };
  const zoom = 12;
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
  

  // Used to display the list of rides or the map
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };



  
  // Access the map object
  const mapRef = useMap();

  useEffect(() => {
      if(mapRef.current !== null){
        console.log("Map Loaded \n Map ref: ", mapRef.current);
      }
  }
  , [checked, mapRef]);



  return (
    <>
      <LayoutMain>
        <div className="bg-[var(--purple-g3)]">
          <div className="mt-2 flex flex-col items-center">
            <div className="border-b-t-2 flex flex-row border-0 border-white">
              <div
                className="mx-12 mb-4 rounded-[5%] border-y-2 border-fuchsia-700 
                           bg-[var(--purple-g3)] p-4 text-center text-xl text-fuchsia-700 md:text-2xl"
              >
                <p>Trouver un trajet</p>
              </div>
              <div className="col-span-1 right-1 w-max bottom-5 absolute  flex items-center justify-center">
                <div className="m-4 rounded-full z-1 my-auto px-4 py-2 text-base text-white">
                  <Slider check={handleCheck} checked={checked} />
                  <div className={`mx-2 absolute -top-3  ${!checked ? "text-[var(--pink-g1)] font-bold" : "text-white"}`}>
                    {checked ? "Carte" : "Liste"}
                  </div>
                </div>
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
          {!checked && (
            <>
              <div className="h-box my-4 w-auto border-fuchsia-700 bg-white text-fuchsia-700">
                {rideList?.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    driver={ride.driver.name}
                    driverImg={ride.driver.image ?? "/avatar.png"}
                    goToRide={() => handleClick(ride.id)}
                  />
                ))}
              </div>
            </>
          )}
          {/* -------------------------------------- display map ---------------------------------------------- */}
          {checked && (
            <>
              <Map 
                zoom={zoom} 
                center={center}
              />
            </>
          )}
        </div>
      </LayoutMain>
    </>
  );
};

export default AllRides;
