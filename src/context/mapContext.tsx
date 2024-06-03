import React, { createContext, useContext, useRef } from 'react';
import type { MutableRefObject } from 'react';

interface MapProviderProps {
    children: React.ReactNode;
}

// Type for the map reference
type MapRef = MutableRefObject<google.maps.Map | null>;

const MapContext = createContext<MapRef | null>(null);


export const MapProvider = ({ children }: MapProviderProps) => {
    const mapRef: MapRef = useRef<google.maps.Map | null>(null);

    return (
        <MapContext.Provider value={mapRef}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = (): MapRef => {
    const context = useContext(MapContext);

    if (context === null) {
        throw new Error("useMap must be used within a MapProvider");
    }

    return context;
}
