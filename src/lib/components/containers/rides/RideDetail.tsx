/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
// rideDetails.tsx
import type { RideDetailsProps } from "$/lib/types/interfaces";
import React from 'react';
import { formatAddress, getCampusNameWithAddress } from "$/utils/data/school";
import { RideType } from "@prisma/client";
import { FaClock } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { RiSchoolFill } from "react-icons/ri";
import { GiBackwardTime } from "react-icons/gi";
import { FaUsers, FaCircle, FaCircleDot, FaHouseChimney } from "react-icons/fa6";

const rideDetail: React.FC<RideDetailsProps> = ({ ride, children, driver, imageDriver }: RideDetailsProps) => {


  const school: string[] | undefined = getCampusNameWithAddress(ride.destination)?.split(" - ");
  const schoolName: string = school ? school[0]! : "";
  const campusName: string = school ? school[1]! : "";
  const isToday = ride.departureDateTime.getDate() === new Date().getDate() ? true : false;

  return (
    <div className="bg-[var(--purple-g3)] border-2 border-[var(--pink-g1)] p-2 rounded text-[var(--dark-gray)] p-1 m-1 mx-3 text-lg">
      <div>
        <div className="flex items-center flex-row text-white mb-2">
          <MdDateRange className="h-[2.25rem] w-[2.25rem] mr-2 text-[var(--pink-g1)] " />
          <div>
            {isToday ? "Aujourd'hui" : ride.departureDateTime.toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center flex-row text-white mb-2">
          <img
            className="w-9 h-9 rounded-full mr-2"
            src={imageDriver ?? "/avatar.png"}
            alt="Profil Pic"
          />
          <div>
            {driver}
          </div>
        </div>
        <div className="flex items-center flex-row text-white mb-2">
          <FaUsers className="h-[2.25rem] w-[2.25rem] mr-2 text-[var(--pink-g1)] " />
          <div>
            {ride.maxPassengers} passagers
          </div>
        </div>
        {/* 
        ///
        */}
        <div className="flex flex-row justify-center">
          <div className="flex flex-col items-center mt-4">
            <FaCircleDot className="text-[var(--pink-g1)]" />
            <div className="border-l-4 border-[var(--pink-g1)] border-dashed h-28 sm:h-24"></div>
            <FaCircle className="text-[var(--pink-g1)]" />
          </div>
          <div className="pb-2 m-2 text-white">
            <div className="mb-11">
              <div className="flex flex-row ml-1 items-start mb-2">
                <FaHouseChimney className="h-[2rem] w-[2rem] mr-2 text-[var(--pink-g1)]" />
                <div>
                  {formatAddress(ride.departure)}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-center">
                  <FaClock className="h-[1.25rem] w-[1.25rem] mb-[3px] mr-2 text-[var(--pink-g1)]" />
                  {ride.departureDateTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div>
              <div className="flex md:text-lg flex-row items-start mb-2 ml-1">
                <RiSchoolFill className="w-[2.25rem] h-[2.25rem] text-[var(--pink-g1)] mr-2" />
                <div className="leading-none">
                  <div>
                    {schoolName ?? ride.destination}
                  </div>
                  <div>
                    {campusName}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-center">
                  <FaClock className="h-[1.25rem] w-[1.25rem] mb-[3px] mr-2 text-[var(--pink-g1)]" />
                  {ride.arrivalDateTime?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-row text-white mb-2">
          {ride.type === RideType.RETOUR && ride.returnTime && (
            <div className="ride-info flex flex-row items-center">
              <GiBackwardTime className="h-[2rem] w-[2rem] mr-2 text-[var(--pink-g1)] " />
              <div>
                {ride.returnTime.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default rideDetail;
