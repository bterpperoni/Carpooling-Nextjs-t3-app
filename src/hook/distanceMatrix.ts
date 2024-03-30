/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// distance.ts

import { useApiKey } from '$/context/google';
import { useState, useEffect } from 'react';

// Fonction pour calculer la distance entre deux adresses
const calculateDistance = async (origin: string, destination: string): Promise<number> => {
    const apiKey = useApiKey();
  
    try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la requête à l\'API Distance Matrix');
    }

    const data = await response.json();
    const distanceInKilometers = (data.rows[0].elements[0].distance.value) / 1000;
    return distanceInKilometers;
  } catch (error) {
    console.error('An error occured when calculate the distance:', error);
    return -1;
  }
};

// Custom hook to calculate the distance between two addresses
const distanceCalculator = (origin: string, destination: string): number => {
  const [distance, setDistance] = useState<number>(-1);

  useEffect(() => {
    calculateDistance(origin, destination)
      .then((result) => setDistance(result))
      .catch((error) => console.error('Erreur lors du calcul de la distance :', error));
  }, [origin, destination]);

  return distance;
};

export default distanceCalculator;
