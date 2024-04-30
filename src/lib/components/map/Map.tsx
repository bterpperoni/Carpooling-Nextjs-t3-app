/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useRef } from "react";
import type { MapProps } from "$/lib/types/types";
import { useApiKey } from "$/context/apiContext";
import Error from "next/error";
import { Loader } from "@googlemaps/js-api-loader";
import { resolve } from "path";
import { error } from 'console';

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
    
      function initMap(): Promise<google.maps.Map> {
         // Initialize and add the map
        let map: google.maps.Map;
        const loader = new Loader({
          apiKey: apiKey ?? "",
          version: "weekly",
          libraries: ["maps", "marker"]
        });

        return new Promise((resolve, reject) => {
          try{
            loader.importLibrary('maps')
            .then(({Map}) => {
              // The map, centered at 
              map = new Map(document.getElementById("map") as HTMLDivElement, {
                  center: center ?? position,
                  zoom: zoom ?? 12,
                  clickableIcons: true,
                  mapId: `map-${(Math.random() * 999).toFixed(0)}`
                });
              // Set the map to the mapReference
              mapRef.current = map;
              resolve(mapRef.current);
            })
          } catch(error) {
            console.error('Une erreur est survenue lors de la création de la carte :', error);
            reject(error);
          };
        });
      }

      // Load the map when the component is mounted 
      initMap();

  }, [apiKey, center, zoom]);

  if (!apiKey) {
    throw new Error({title:"API key is not defined", statusCode: 0});
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
