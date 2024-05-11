import type { Booking, Ride } from "@prisma/client";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type Children = {
    children : React.ReactNode;
}

export type ButtonProps = {
    href?: string;
    children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>

export type TypeRideAsPassenger = Ride & {
  driver: { name: string; email: string | null; image: string | null } | null;
} | null;

export type ApiResponse = { success: boolean, message?: string };

export type DistanceMatrixPromise = {
  distance: number;
  duration: number;
};

export type Notification = {
  message: string;
}

export type RideInformationsProps = { rideId: number, driverId: string, destination: string }

export type BookingInformationsProps = { driverId: string, passengerName: string };

export type CalendarCardProps = { 
  ride: Ride | null,
  bookings?: Booking[],
  isDriver?: boolean,
  onClick: () => void
};