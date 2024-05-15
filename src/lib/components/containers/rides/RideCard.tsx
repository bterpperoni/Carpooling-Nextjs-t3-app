/* eslint-disable @next/next/no-img-element */
// rideCard.tsx
import type { RideCardProps } from "$/lib/types/interfaces";
import { getCampusNameWithAddress } from "$/utils/data/school";

const rideCard: React.FC<RideCardProps> = ({ ride, goToRide, driver }) => {

  return (
    <div className="ride-card-container cursor-pointer" onClick={goToRide}>
     <div key={ride.id}>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                  <div className="mb-4 flex items-center">
                    <img
                      src={"/images/logo.png" ?? "/avatar.png"}
                      alt="Avatar de l'utilisateur"
                      className="mr-3 h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{driver}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">
                      {ride.departure} → {getCampusNameWithAddress(ride.destination) ?? ride.destination}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <p>
                      Départ:{" "}
                      {ride.departureDateTime.toLocaleDateString()}
                    </p>
                    {ride.returnTime ? (
                      <p>
                      Heure de retour:{" "}
                      {ride.returnTime?.toLocaleTimeString()}
                    </p>
                    ):
                    <p>
                      Pas de retour
                    </p>}
                  </div>
                </div>
              </div>
    </div>
  );
};

export default rideCard;
