import React, { createContext, useContext, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Error from "next/error";
// Créez le contexte

type GoogleApiContextType = google.maps.PlacesLibrary | null;

const GoogleApiContext = createContext<GoogleApiContextType>(null);

type AsyncLoadApiProviderProps = {
    children: React.ReactNode;
};

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// ----------------------------REACT Provider---------------
export const AsyncLoadPlacesProvider = ({ children}: AsyncLoadApiProviderProps) => {

  const [googleApi, setGoogleApi] = useState<google.maps.PlacesLibrary | null>(null);
  // Load the Google Maps API when the component is mounted
  useEffect(() => {
    if (!apiKey) throw new Error({ title: "API key is not defined", statusCode: 404 });

    // Initialize the loader of the Google Maps API
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      region: "BE",
      retries: 3,
      language: "fr"
    });

    void loader.importLibrary("places").then((google) => {
      if(google === null) throw new Error({ title: "Google Places API not loaded", statusCode: 404 });
      setGoogleApi(google);
      console.log("Google Places API loaded");
    });
  }, []);

///
  return (
    <GoogleApiContext.Provider value={googleApi}>
      {children}
    </GoogleApiContext.Provider>
  );
};

// ------------------------REACT Hook---------------------------------
export const loadGooglePlacesApi = (): Promise<GoogleApiContextType> => {
  const googleApi = useContext(GoogleApiContext);

  if (googleApi === null) {
    throw new Error({title: "useGoogleApi must be used within a GoogleApiProvider", statusCode: 404});
  }
  return Promise.resolve(googleApi);
};
