
import React, { useEffect, useRef, useState } from 'react';
import { MapProps } from '$/utils/interface';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';



const Map: React.FC<MapProps> = ({ center, zoom, markerPosition }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '25rem',
  };

  const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;

  // Used to access the map object
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Used to set the map options
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setOptions({ gestureHandling: 'greedy' });
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
            onLoad={(map) =>{
                mapRef.current = map;
                setIsMapLoaded(true);
            }}
            onUnmount={() => setIsMapLoaded(false)}
        >
           {isMapLoaded && <Marker position={markerPosition} /> }
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
