

export async function calculateDistance(origin: string, destination: string): Promise<string> 
{
    return new Promise((resolve, reject) => 
      {
      const service = new google.maps.DistanceMatrixService();
      void service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => 
          {
          if (status === google.maps.DistanceMatrixStatus.OK) 
            {
            if (response && response.rows.length > 0) 
            {
              if(response.rows[0]?.elements[0]?.distance.value !== undefined)
              {
                  const distance = response.rows[0]?.elements[0]?.distance.value;
                  resolve(distance.toString());
              }
            } 
            else 
            {
              console.error('Aucune réponse valide du service de calcul de distance.');
              reject(new Error('Aucune réponse valide du service de calcul de distance.'));
            }
          } 
          else 
          {
            console.error('Erreur lors du calcul de la distance: ' + status);
            reject(new Error('Erreur lors du calcul de la distance: ' + status));
          }
        }
      );
    });
}
