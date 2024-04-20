// rideDetails.tsx
import type { RideDetailsProps } from "$/lib/types/interfaces";
import React from 'react';
import { getCampusNameWithAddress } from "$/utils/data/school";
import { RideType } from "@prisma/client";

const rideDetail: React.FC<RideDetailsProps> = ({ ride, children }: RideDetailsProps) => {

  const campusName: string | null = getCampusNameWithAddress(ride.destination);

  return (
    <div className="ride-details-container">
      <div className="ride-info flex flex-row justify-between">
        <div>
            <span className="label">Départ:</span>
            {ride.departure}
        </div>
      </div>
      <div className="ride-info flex flex-row justify-between">
        <div>
            <span className="label">Date de départ :</span>
            Le {ride.departureDateTime.toLocaleDateString()} à {ride.departureDateTime.toLocaleTimeString()}
        </div>
      </div>
      <div className="ride-info flex flex-row justify-between">
        <div>
            <span className="label">Destination:</span>
            {campusName ?? ride.destination}
        </div>
      </div>
      {ride.type === RideType.RETOUR && ride.returnTime && (
        <div className="ride-info flex flex-row justify-between">
            <div>
                <span className="label">Heure de retour:</span>
                {ride.returnTime.toLocaleTimeString()}
            </div>
        </div>
      )}

        {children}  

      <style jsx>{`
        .ride-details-container {
          background-color: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 20px;
          margin: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .ride-info {
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

export default rideDetail;
