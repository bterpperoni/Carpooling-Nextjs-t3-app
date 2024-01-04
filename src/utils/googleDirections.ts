import { GoogleDirectionsResponse } from "./interface";
import axios from 'axios';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export const geocode = async (address: string): Promise<string> => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
  
        const results = response.data.results;
  
        if (!results || results.length === 0) {
          throw new Error(`No results found for the address: ${address}`);
        }
  
        const location = results[0].geometry?.location;
  
        if (!location) {
          throw new Error(`Location not found in the geocoding response for the address: ${address}`);
        }
  
        return `${location.lat},${location.lng}`;
      } catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
      }
    };
  