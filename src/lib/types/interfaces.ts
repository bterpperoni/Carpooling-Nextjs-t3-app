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

   // Typescript interface for request body
  export interface RequestBody {
    order_price: number;
    user_id: string;
  }