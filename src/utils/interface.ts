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

/* --------------------------------------------- ENUM -------------------------------------------------------- */
export enum userRole{
    ADMIN = 'admin',
    USER = 'user',
    BANNED = 'banned'
}

/* --------------------------------------------- INTERFACES -------------------------------------------------- */

export type MapProps = {
    center: google.maps.LatLngLiteral;
    zoom: number;
    children: React.ReactNode | undefined;
  }