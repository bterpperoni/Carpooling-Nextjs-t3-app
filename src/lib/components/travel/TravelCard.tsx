// travelCard.tsx


import type { Travel } from "@prisma/client";

interface TravelCardProps {
  travel: Travel;
  driver?: string;
  goToTravel: () => void;
}

const TravelCard: React.FC<TravelCardProps> = ({ travel, driver, goToTravel }) => {
  return (
    <div className="travel-card-container" onClick={goToTravel}>
      <div className="travel-info">
        <span className="label">Date:</span>
        {travel.departureDateTime.toLocaleDateString()}
      </div>
      <div className="travel-info">
        <span className="label">Départ:</span>
        {travel.departure}
      </div>
      <div className="travel-info">
        <span className="label">Destination:</span>
        {travel.destination}
      </div>
      <div className="travel-info">
        <span className="label">Conducteur:</span>
        {driver}
      </div>

      <style jsx>{`
        .travel-card-container {
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px;
          margin: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .travel-info {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .label {
          font-weight: bold;
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default TravelCard;
