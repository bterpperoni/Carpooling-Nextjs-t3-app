/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import type { MapProps } from '$/lib/types/types';
import { useApiKey } from '$/context/api';

function Map({ center, zoom, children, onLoad, reference }: MapProps) {

  const apiKey = useApiKey();

  // Set the map container style
  const mapContainerStyle = {
    width: '100%',
    height: '25rem',
  };

  // Access the map object
  // const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  if(!apiKey) return <div>Google maps api key is missing</div>
  return (
    <>
      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
            id='map'
            center={center} 
            zoom={zoom} 
            mapContainerStyle={mapContainerStyle}
            ref={(map) => {
              {reference} map as google.maps.Map | null | undefined;            
            }}
            onLoad={onLoad ? onLoad : async () => setIsMapLoaded(true)}
            onUnmount={async () => setIsMapLoaded(false)}>
            {isMapLoaded && children}
        </GoogleMap>
      </LoadScriptNext>
    </>
  );
};

export default Map;
