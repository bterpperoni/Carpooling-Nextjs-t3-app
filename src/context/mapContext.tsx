import React, { createContext, useContext, useRef } from 'react';

const MapContext = createContext<google.maps.Map | null>(null);

interface MapProviderProps {
    children: React.ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
    const mapRef = useRef(null);

    return (
        <MapContext.Provider value={mapRef.current}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => useContext(MapContext)