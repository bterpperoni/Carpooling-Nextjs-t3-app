import type { Ride } from "@prisma/client";
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
        value: string | number | readonly string[] | undefined;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        classInput?: string;
        classLabel?: string;
}



export   type TypeReturnRideAsPassenger = ({
  driver: { name: string; email: string | null; image: string | null };
} & Ride)[];

export type ApiResponse = { success: boolean, message?: string };

export type RideInformationsProps = { rideId: number; driverId: string; destination: string}

export type DistanceMatrixPromise = {
  distance: number;
  duration: number;
};
