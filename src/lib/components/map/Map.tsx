/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import type { MapProps } from '$/lib/types/types';
import { ApiKeyProvider, useApiKey } from '$/context/process';

function Map({ center, zoom, children, onLoad }: MapProps) {

  const apiKey = useApiKey();

  // Set the map container style
  const mapContainerStyle = {
    width: '100%',
    height: '25rem',
  };

  // Access the map object
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Set the map options
  useEffect(() => {
    if (mapRef.current) {
      console.log('mapRef.current', mapRef.current);
    }
  }, [mapRef]);

  if(!apiKey) return <div>Google maps api key is missing</div>
  return (
    <>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap 
            center={center} 
            zoom={zoom} 
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad ? onLoad : () => setIsMapLoaded(true)}
            onUnmount={() => setIsMapLoaded(false)}>
            {isMapLoaded && children}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
