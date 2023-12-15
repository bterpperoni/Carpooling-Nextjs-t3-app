
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
    height: '400px',
  };

  const key = process.env.GOOGLE_MAPS_API_KEY as string;

  console.log(key);


  if(!key) return <h1>no key</h1>
  return (
    <>
      <LoadScript googleMapsApiKey={key}>
        <GoogleMap center={center} zoom={zoom} mapContainerStyle={mapContainerStyle}>
          <Marker position={markerPosition} />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
