import type { Booking, Ride } from "@prisma/client";
import type { ChangeEvent } from "react";

export interface Campus {
    campus_ref: string;
    campus_name: string;
    address: string;
  }
  
export interface School {
    reference: string;
    name: string;
    city: string;
    pays: string;
    campus: Campus[];
  }

export interface RideCardProps {
  driverImg: string;
  ride: Ride;
  driver?: string;
  goToRide: () => void;
}

export interface RideDetailsProps {
  ride: Ride;
  driver: string;
  imageDriver: string;
  children?: React.ReactNode;
  isActualUserride?: boolean;
}
  
export interface DropdownProps {
    data: { school: School[] };
    styleDropdown?: string;
    colorLabel?: string;
    onChange: (selectedSchool: ChangeEvent<HTMLSelectElement>, selectedCampus:  ChangeEvent<HTMLSelectElement> ) => void;
  }

  export interface RequestBody {
    order_price: string;
    user_id: string;
  }

  export interface PaypalTokenResponse {
    access_token: string;
  }

  export interface InputProps {
    label: string;
    type: string;
    value: string | number | readonly string[] | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    classInput?: string;
    classLabel?: string;
}
