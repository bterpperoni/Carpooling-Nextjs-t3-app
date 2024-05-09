/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ApiResponse, BookingInformationsProps } from "$/lib/types/types";
import axios from "axios";




export const notifyStatusChecked = async (bookingUpdate: BookingInformationsProps): Promise<void> => {

    const bookingInfos = bookingUpdate;
    try {
        const response = await axios.post<ApiResponse>('/api/pusher/notify-status-checked', {
          bookingInfos
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
  