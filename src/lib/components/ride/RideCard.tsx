// rideCard.tsx
import type { RideCardProps } from "$/lib/types/interfaces";

const rideCard: React.FC<RideCardProps> = ({ ride, driver, goToRide }) => {
  return (
    <div className="ride-card-container" onClick={goToRide}>
      <div className="ride-info">
        <span className="label">Date:</span>
        {ride.departureDateTime.toLocaleDateString()}
      </div>
      <div className="ride-info">
        <span className="label">Départ:</span>
        {ride.departure}
      </div>
      <div className="ride-info">
        <span className="label">Destination:</span>
        {ride.destination}
      </div>
      <div className="ride-info">
        <span className="label">Conducteur:</span>
        {driver ?? ride.driverId}
      </div>

      <style jsx>{`
        .ride-card-container {
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px;
          margin: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .ride-info {
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

export default rideCard;
