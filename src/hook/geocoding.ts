/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useApiKey } from '$/context/google';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Geocode an address using the Google Maps Geocoding API --------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
const geocode = async (address: string): Promise<{location: google.maps.LatLng|null, formattedAddress: string, placeId: string}> => {

  const apiKey = useApiKey();
  if (!apiKey) {
    throw new Error('Google Maps API Key not found!');
  }

  try {
    // Geocode an address..
    const response: AxiosResponse<any, any> = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    // Store results from geocoding response. 
    const results: google.maps.GeocoderResult[] = response.data.results;

    if (!results || results.length === 0) {
      throw new Error(`No results found for the address: ${address}`);
    }
    if (results[0]) {
      // Set the data to return from the geocoding response
      const location: google.maps.LatLng = results[0].geometry.location;
      const formattedAddress: string = results[0].formatted_address;
      const placeId: string = results[0].place_id;

      if (!location) {
        throw new Error(`Location not found in the geocoding response for the address: ${address}`);
      }
      // Return the data from the geocoding response in an object
      return { formattedAddress, location, placeId } as { location: google.maps.LatLng, formattedAddress: string, placeId: string };
    }else{
      throw new Error(`No results found for the address: ${address}`);
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

// Custom hook to geocode an address
const geocodeAddress = async (address: string): Promise<google.maps.LatLng|null> => {
  try {
    const { location } = await geocode(address);
    return location;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

export default geocodeAddress;
  