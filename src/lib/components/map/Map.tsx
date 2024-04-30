/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useRef } from "react";
import type { MapProps } from "$/lib/types/types";
import { useApiKey } from "$/context/api";
import Error from "next/error";
import { Loader } from "@googlemaps/js-api-loader";

function Map({ center, zoom, children }: MapProps) {
  
  const apiKey = useApiKey();

  const position ={
    "lat": 50.4637089,
    "lng": 3.956881
  }
  // Access the map object
  const mapRef = useRef<google.maps.Map | null>(null);


  // Set the map options
  useEffect(() => {   
    
      function initMap(): void {
      
         // Initialize and add the map
        let map: google.maps.Map;
        const loader = new Loader({
          apiKey: apiKey ?? "",
          version: "weekly",
          libraries: ["maps"]
        });

        loader.importLibrary('maps')
        .then(({Map}) => {
          // The map, centered at 
         mapRef.current = new Map(document.getElementById("map") as HTMLDivElement, {
            center: center ?? position,
            zoom: zoom ?? 12,
            clickableIcons: true,
            mapId:'map'
          });
        })
        .catch((e) => {
          console.error(e);
      });
    }

    initMap();

  }, []);

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
      <div
        id="map"
        style={{ width: "100%", height: "50vh" }}
        className="p-2 border-2 border-black rounded-lg"
      >
        {children}
      </div>
    </>
  );
}

export default Map;
