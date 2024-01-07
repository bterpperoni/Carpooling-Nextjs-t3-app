import { AnchorHTMLAttributes, ButtonHTMLAttributes, ChangeEvent } from "react";

/* --------------------------------------------- TYPES ---------------------------------------------------- */

export type Children = {
    children : React.ReactNode;
}

export type ButtonProps = {
    href?: string;
    children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>

export type InputProps = {
        label: string;
        type: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        classInput?: string;
}

export type MapProps = {
    center?: google.maps.LatLngLiteral;
    zoom: number;
    children?: React.ReactNode | undefined;
    onLoad?: (map: google.maps.Map) => void;
  }

/* --------------------------------------------- ENUM -------------------------------------------------------- */
export enum userRole{
    ADMIN = 'admin',
    USER = 'user',
    BANNED = 'banned'
}

/* --------------------------------------------- INTERFACES -------------------------------------------------- */

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