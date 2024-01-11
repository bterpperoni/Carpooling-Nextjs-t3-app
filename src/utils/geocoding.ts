/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { env } from 'process';



export const geocode = async (address: string): Promise<{location: google.maps.LatLng|null, formattedAddress: string, placeId: string}> => {

  if (!env.GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API Key not found!');
  }
  const apiKey = env.GOOGLE_MAPS_API_KEY;
  try {
    const response: AxiosResponse<any, any> = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    const results: google.maps.GeocoderResult[] = response.data.results;

    if (!results || results.length === 0) {
      throw new Error(`No results found for the address: ${address}`);
    }
    if (results[0]) {
      const location: google.maps.LatLng = results[0].geometry.location;
      const formattedAddress: string = results[0].formatted_address;
      const placeId: string = results[0].place_id;

      if (!location) {
        throw new Error(`Location not found in the geocoding response for the address: ${address}`);
      }
      return { formattedAddress, location, placeId } as { location: google.maps.LatLng, formattedAddress: string, placeId: string };
    }else{
      throw new Error(`No results found for the address: ${address}`);
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};
  