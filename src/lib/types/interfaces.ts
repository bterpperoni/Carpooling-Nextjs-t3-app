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
  
export interface DropdownProps {
    data: { school: School[] };
    onChange: (selectedSchool: ChangeEvent<HTMLSelectElement>, selectedCampus:  ChangeEvent<HTMLSelectElement> ) => void;
  }

  export interface RequestBody {
    order_price: string;
    user_id: string;
  }

  export interface PaypalTokenResponse {
    access_token: string;

  }