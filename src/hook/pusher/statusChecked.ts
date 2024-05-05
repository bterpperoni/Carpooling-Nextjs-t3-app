/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ApiResponse, ContentBodyChecked } from "$/lib/types/types";
import axios from "axios";




export const notifyStatusChecked = async (bookingUpdate: ContentBodyChecked, passengersAndDriver: (string | undefined)[]): Promise<void> => {

    const { bookingInfos, passengersAndDriverList } = { bookingInfos: { bookingUpdate }, passengersAndDriverList: passengersAndDriver };
    try {
        const response = await axios.post<ApiResponse>('/api/pusher/notify-status-checked', {
          bookingInfos,
          passengersAndDriverList
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
  