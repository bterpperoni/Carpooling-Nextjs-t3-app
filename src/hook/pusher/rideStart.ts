/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { RideInformationsProps, ApiResponse } from "$/lib/types/types";
import axios from "axios";


export const notifyStartRide = async ({rideId, driverId, destination}: RideInformationsProps, passengersNameList: string[]): Promise<void> => {

    const { rideInfos, passengers } = { rideInfos: { rideId: rideId, driverId: driverId, destination: destination }, passengers: passengersNameList };
    try {
        const response = await axios.post<ApiResponse>('/api/pusher/notify-ride-start', {
          rideInfos,
          passengers
        });
        
        console.log('Succès:', response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Erreur Axios:', error.response?.data);
        } else {
          console.error('Erreur inconnue:', error);
        }
      }
  };
  