import type { ApiResponse, BookingInformationsProps } from "$/lib/types/types";
import axios from "axios";




export const notifyStatusChecked = async ({driverId, passengerName}: BookingInformationsProps): Promise<void> => {

   const { bookingInfos } = { bookingInfos: { driverId: driverId, passengerName: passengerName }}; 
   
    try {
        const response = await axios.post<ApiResponse>('/api/pusher/notify-status-checked', {
          bookingInfos
        });

        console.log('Succès:', response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response)
          console.error('Erreur Axios:', error);
        } else {
          console.error('Erreur inconnue:', error);
        }
      }
  };
  