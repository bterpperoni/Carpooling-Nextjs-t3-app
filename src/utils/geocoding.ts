import axios from 'axios';
import { env } from 'next.config';



export const geocode = async (address: string): Promise<{}> => {


      const apiKey = env.GOOGLE_MAPS_API_KEY;
    
      if (!apiKey) {
        throw new Error('Google Maps API Key not found!');
      }
      
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );

        const results = response.data.results;

        if (!results || results.length === 0) {
          throw new Error(`No results found for the address: ${address}`);
        }

        const location = results[0].geometry?.location;
        const formattedAddress = results[0].formatted_address;
        const placeId = results[0].place_id;
  
        if (!location) {
          throw new Error(`Location not found in the geocoding response for the address: ${address}`);
        }
  
        return { formattedAddress, location, placeId };
      } catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
      }
    };
  