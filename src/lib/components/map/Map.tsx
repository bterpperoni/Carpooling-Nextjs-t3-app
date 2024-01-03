import React, { Children, useEffect, useRef, useState } from 'react';
import { MapProps } from '$/utils/interface';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { env } from 'next.config';



const Map: React.FC<MapProps> = ({ center, zoom, children, onLoad}: MapProps) => {
  const mapContainerStyle = {
    width: '100%',
    height: '25rem',
  };

  const apiKey = env.GOOGLE_MAPS_API_KEY as string;

  // Used to access the map object
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Used to set the map options
  useEffect(() => {
    if (mapRef.current) {
      console.log('mapRef.current', mapRef.current);
    }
  }, [isMapLoaded]);




  if(!apiKey) return <div>Google maps api key is missing</div>
  return (
    <>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap 
            center={center} 
            zoom={zoom} 
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad}
            onUnmount={() => setIsMapLoaded(false)}>
           {children}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
