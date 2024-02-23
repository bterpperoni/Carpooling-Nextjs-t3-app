import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ChangeEvent } from "react";

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
        value: string | null;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        classInput?: string;
        classLabel?: string;
}

export type MapProps = {
  center?: google.maps.LatLngLiteral;
  zoom: number;
  children?: React.ReactNode | undefined;
  onLoad?: (map: google.maps.Map) => void;
};




