import type { Booking, BookingStatus, Ride, User } from "@prisma/client";
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

export type SortedBookingProps = { 
  id: string | undefined,
  baseIndex: number| undefined,
  pickupPoint: string | undefined,
  toNext: {distanceToNext: number| undefined, durationToNext: number| undefined},
  date: { departureDateTime: Date| undefined, arrivalDateTime: Date| undefined, returnDateTime: Date| undefined}
  price: number| undefined,
  status: BookingStatus
}

export type OrderBookingProps = {
  baseIndex: number,
  sortedIndex: number,
  booking: Booking | undefined,
}

