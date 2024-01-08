import React, { useEffect, useRef, useState } from 'react';
import type { MapProps } from '$/utils/interface';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import config  from 'next.config';


function Map({ center, zoom, children, onLoad }: MapProps) {

  const apiKey = config.env?.GOOGLE_MAPS_API_KEY;
  
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
    {/* LoadScript  */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap 
            center={center} 
            zoom={zoom} 
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad}
            onUnmount={() => setIsMapLoaded(false)}>
            {isMapLoaded &&
              <div>
                
              </div>
            }
            {children}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
