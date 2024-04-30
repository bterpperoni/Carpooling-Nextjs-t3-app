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
  onMapLoad?: () => void;
};

const Map: React.FC<MapProps> = ({ center, zoom, children, onMapLoad  }) => {
  const apiKey = useApiKey();

  const position = {
    lat: 50.4637089,
    lng: 3.956881,
  };
  // Access the map object
  const mapRef = useMap();
  // Reference to the map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apiKey) throw new Error({ title: "API key is not defined", statusCode: 0 });

    // Initialize the loader of the Google Maps API
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      region: "BE",
      retries: 3,
      language: "fr",
      id: "routes-loader"
    });

    let map: google.maps.Map;
    // Load the library and create the map 
    loader.importLibrary("maps").then(({ Map }) => {
      // The map object
      map = new Map(mapContainerRef.current!, {
        center: center ?? position,
        zoom: zoom ?? 12,
        clickableIcons: true,
        mapId: `map-${(Math.random() * 999).toFixed(0)}`
      });
      // Set the map object in the context
      mapRef.current = map;

      if(onMapLoad) {
        onMapLoad();
      }

    });

    // loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
    //   // The marker, positioned at
    //   new AdvancedMarkerElement({
    //     position: position,
    //     map: map,
    //     title: `Trajet n°${ride?.id}`
    //   });
    // });
  }, [mapRef, center, zoom, apiKey, onMapLoad]);

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "50vh" }}
        className="rounded-lg border-2 border-black p-2"
      >
        {children}
      </div>
    </>
  );
}

export default Map;
