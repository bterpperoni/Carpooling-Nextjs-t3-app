// travelDetails.tsx

import type { Travel } from '@prisma/client';

interface TravelDetailsProps {
  travel: Travel;
}

const TravelDetail: React.FC<TravelDetailsProps> = ({ travel }) => {


  return (
    <div className="travel-details-container">
      <div className="travel-info">
        <span className="label">Départ:</span>
        {travel.departure}
      </div>
      <div className="travel-info">
        <span className="label">Date:</span>
        {travel.departureDateTime.toLocaleDateString()}
      </div>
      <div className="travel-info">
        <span className="label">Destination:</span>
        {travel.destination}
      </div>
      {travel.returnDateTime != null && (
        <div className="travel-info">
          <span className="label">Date de retour:</span>
          {travel.returnDateTime.toLocaleDateString()}
        </div>
      )}

      <style jsx>{`
        .travel-details-container {
          background-color: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 20px;
          margin: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .travel-info {
          font-size: 1rem;
          margin-bottom: 5px;
          border-bottom: 2px solid #1e1b1b;
        }

        .label {
          font-weight: bold;
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default TravelDetail;
