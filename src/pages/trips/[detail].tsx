import { useRouter } from "next/dist/client/router";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import TravelDetail from "$/lib/components/travel/TravelDetail";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import Map from "$/lib/components/map/Map";
import { use, useEffect } from "react";
import { Marker } from "@react-google-maps/api";


const Detail = () => {
  const router = useRouter()
  const id = parseInt(router.query.detail as string);  

  
    // Session recovery
    const { data: sessionData } = useSession();

    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});

    const center: google.maps.LatLngLiteral =  { lat: travel?.departureLatitude as number, lng: travel?.departureLongitude as number };
    const zoom: number = 12;

  if(!travel) return <div>Travel not found</div>
  return (
    <>
        <LayoutMain>
            <Map center={center} zoom={zoom}>
                <Marker position={center} />
            </Map>
            <TravelDetail travel={travel} />
        </LayoutMain>
    </>
  )
}

export default Detail;