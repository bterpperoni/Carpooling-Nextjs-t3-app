// travelDetails.tsx

import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import type { Travel } from '@prisma/client';
import React, { useState } from 'react';
import Autocomplete from "react-google-autocomplete";
import { env } from 'next.config.js';
import dayjs from 'dayjs';

interface TravelDetailsProps {
  travel: Travel;
  children?: React.ReactNode;
  isActualUserTravel?: boolean;
}

const TravelDetail: React.FC<TravelDetailsProps> = ({ travel, children }: TravelDetailsProps) => {

  return (
    <div className="travel-details-container">
      <div className="travel-info flex flex-row justify-between">
        <div>
            <span className="label">Départ:</span>
            {travel.departure}
        </div>
      </div>
      <div className="travel-info flex flex-row justify-between">
        <div>
            <span className="label">Date de départ :</span>
            Le {travel.departureDateTime.toLocaleDateString()} à {travel.departureDateTime.toLocaleTimeString()}
        </div>
      </div>
      <div className="travel-info flex flex-row justify-between">
        <div>
            <span className="label">Destination:</span>
            {travel.destination}
        </div>
      </div>
      {travel.returnDateTime != null && (
        <div className="travel-info flex flex-row justify-between">
            <div>
                <span className="label">Date de retour:</span>
                Le {travel.returnDateTime.toLocaleDateString()} à {travel.returnDateTime.toLocaleTimeString()}
            </div>
        </div>
      )}

        {children}  

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
