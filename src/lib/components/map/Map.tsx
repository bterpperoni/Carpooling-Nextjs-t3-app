/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScriptNext
} from "@react-google-maps/api";
import type { MapProps } from "$/lib/types/types";
import { useApiKey } from "$/context/api";
import Error from "../error/Error";



function Map({ center, zoom, children, onLoad }: MapProps) {
  const apiKey = useApiKey();

  // Set the map container style
  const mapContainerStyle = {
    width: "100%",
    height: "25rem",
  };
  // Access the map object
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Set the map options
  useEffect(() => {
    if (isMapLoaded) {
      console.log("Map is loaded");
    }
  }, [isMapLoaded]);

  if (!apiKey) {
    return (
      <div>
        {" "}
        <Error statusCode={0} />{" "}
      </div>
    );
  }
  return (
    <>
      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
          id="mapId"
          center={center}
          zoom={zoom}
          mapContainerStyle={mapContainerStyle}
          onLoad={async (map) => {
            mapRef.current = map;
            setIsMapLoaded(true);
            await google.maps.importLibrary("maps");
            onLoad && onLoad(mapRef.current);
          }}
          children={children}
          onUnmount={() => {
            console.log("Map is unmounted");
            setIsMapLoaded(false);
          }}
        ></GoogleMap>
      </LoadScriptNext>
    </>
  );
}

export default Map;
