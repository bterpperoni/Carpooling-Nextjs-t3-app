
import React from 'react';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markerPosition: google.maps.LatLngLiteral;
}

const Map: React.FC<MapProps> = ({ center, zoom, markerPosition }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '25rem',
  };

  const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;



  if(!apiKey) return <h1>no key</h1>
  return (
    <>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap center={center} zoom={zoom} mapContainerStyle={mapContainerStyle}>
          <Marker position={markerPosition} />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
