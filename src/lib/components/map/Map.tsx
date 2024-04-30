/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useRef } from "react";
import { useApiKey } from "$/context/apiContext";
import Error from "next/error";
import { Loader } from "@googlemaps/js-api-loader";
import { useMap } from "$/context/mapContext";
import type { Ride } from "@prisma/client";

declare global {
  interface Window {
    initMap: () => void;
  }
}

type MapProps = {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  children?: React.ReactNode | undefined;
  ride?: Ride;
};

const Map: React.FC<MapProps> = ({ center, zoom, children }) => {
  const apiKey = useApiKey();

  const position = {
    lat: 50.4637089,
    lng: 3.956881,
  };
  // Access the map object
  const mapRef = useMap();
  // Reference to the map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Set the map options
  useEffect(() => {
    if (!apiKey) return;

    // Load the map
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly"
    });

    let map: google.maps.Map;

    loader.importLibrary("maps").then(({ Map }) => {
      // The map, centered at
      map = new Map(document.getElementById("map") as HTMLDivElement, {
        center: center ?? position,
        zoom: zoom ?? 12,
        clickableIcons: true,
        mapId: `map-${(Math.random() * 999).toFixed(0)}`,
      });
      mapRef.current = map;
      // console.log("Log in Map Component \n Map ref: ", mapRef.current);
    });

    // loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
    //   // The marker, positioned at
    //   new AdvancedMarkerElement({
    //     position: position,
    //     map: map,
    //     title: `Trajet n°${ride?.id}`
    //   });
    // });
  }, [mapRef]);

  if (!apiKey) {
    throw new Error({ title: "API key is not defined", statusCode: 0 });
  }
  return (
    <>
      <div
        id="map"
        style={{ width: "100%", height: "50vh" }}
        className="rounded-lg border-2 border-black p-2"
      >
        {children}
      </div>
    </>
  );
}

export default Map;
