/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import type Pusher from "pusher-js/types/src/core/pusher";
import React, { useContext } from "react";
import type { ReactNode } from "react";
import { createContext } from "react";

// Define the type for the context
type PusherContextType = Pusher | null;


// Create the context with defined type
const PusherContext = createContext<PusherContextType>(null);

// Type for the provider props
type PusherProviderProps = {
    pusher: Pusher;
    children: ReactNode;
}

// Create the provider component
export const PusherProvider = ({ pusher, children }: PusherProviderProps) => {

  return (
    <PusherContext.Provider value={ pusher }>
      {children}
    </PusherContext.Provider>
  );
}

// Créer le hook personnalisé pour utiliser le contexte Pusher
export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }

  return context;
}
