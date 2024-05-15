/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { DistanceMatrixPromise } from "$/lib/types/types";
import { useEffect, useState } from "react";


export async function calculateDistance(origin: string, destination: string): Promise<DistanceMatrixPromise> {

  return new Promise((resolve, reject) => {
    try {
      const service = new window.google.maps.DistanceMatrixService();
      void service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
        },
        (response, status) => {
          if (status === "OK") {
            if (response?.rows[0]?.elements[0]  && response.rows.length > 0  ) {
              if (response.rows[0].elements[0].distance !== undefined) {
                const distance = response.rows[0].elements[0].distance.value;
                const duration = response.rows[0].elements[0].duration_in_traffic.value;
                resolve({distance: distance, duration: duration});
              }
            } else {
              console.error('Aucune réponse valide du service de calcul de distance.');
              reject(new Error('Aucune réponse valide du service de calcul de distance.'));
            }
          } else {
            console.error('Erreur lors du calcul de la distance: ' + status);
            reject(new Error('Erreur lors du calcul de la distance: ' + status));
          }
        }
      );
    } catch (e) {
      console.log("Empty fields in the form");
    }
  });
}


// Function to display line between driver departure & passenger pickup point
export async function displayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
): Promise<void> {
  console.log("Origin: ", origin, "\nDestination: ", destination);

  directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus,
      ) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.log("Directions request failed due to " + status);
        }
      },
    ).catch((err) => {
      console.log(err);
    });
}

/*
// Implementation of the calculateDetour function to check if a passenger can be included in a ride without exceeding 
// the maximum detour distance.
// The function takes the origin, destination, waypoint, maximum detour distance, and departure time as parameters.
// It returns a boolean indicating if the passenger can be included.
*/
export const calculateDetourEligibility = async (origin: string, destination: string, waypoints: string[], maxDetourDistance: number) => {

  const directionsService = new window.google.maps.DirectionsService;
  // Direct route between origin and destination
  const directRoute = await directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  });
  // Total Distance of the direct route
  const directDistance = directRoute?.routes[0]?.legs[0]?.distance?.value ?? 0;
  
  // Prepare the waypoints for the detour route
  const formattedWaypoints = waypoints.map(waypoint => ({
    location: waypoint,
    stopover: true,
  }));

  const detourRoute: google.maps.DirectionsResult = await directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: formattedWaypoints,
    travelMode: google.maps.TravelMode.DRIVING
  });

  // Total Distance of the detour route
  const detourDistance = detourRoute?.routes[0]?.legs.reduce((acc, leg) => acc + (leg?.distance?.value ?? 0), 0);
  
  // Substract the direct distance with the detour distance
  const detourDifference = (detourDistance ?? 0) - directDistance;
  // Verify if the detour distance is within the maximum detour distance
  if ((detourDifference) <= maxDetourDistance * 1000) {
    console.log("Vous êtes éligible au trajet");
    console.log("Le détour est de ", detourDifference/1000, "km et le détour maximum est de ", maxDetourDistance, "km.");
    return true;
  } else {
    console.log("Le détour est trop important, veuillez vous rapprocher un peu ou trouver un autre trajet.");
    console.log("Le détour est de ", detourDifference/1000, "km et le détour maximum est de ", maxDetourDistance, "km.");
    return false;
  }
};

export const setPolilines =async (map: google.maps.Map | null, origin: string, way_points: string[], destination: string): Promise<void> => {
  
    const directionsService = new window.google.maps.DirectionsService;
    
    await directionsService.route({
      optimizeWaypoints: true,
      origin: origin,
      destination: destination,
      waypoints: way_points.map(waypoint => ({ location: waypoint, stopover: true })),
      travelMode: window.google.maps.TravelMode.DRIVING
    }
    , (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const directionsRenderer = new window.google.maps.DirectionsRenderer;
        directionsRenderer.setMap(map);
        directionsRenderer.setOptions({
          markerOptions: {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "red",
              fillOpacity: 0.8,
              strokeWeight: 1,
              strokeColor: "white"
            },
            optimized: true
          },
          polylineOptions: {
            strokeColor: "red",
            strokeOpacity: 0.5
          },
        });
        directionsRenderer.setDirections(result);
      } else {
        console.log("Error getting directions: ", status,"\n", result);
      }
    });

};