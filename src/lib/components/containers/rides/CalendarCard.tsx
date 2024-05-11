
import type { CalendarCardProps } from "$/lib/types/types";
import { FaCar } from "react-icons/fa";
import { CgArrowLongDownE, CgArrowLongUpE } from "react-icons/cg";
import { PiSeatbeltFill } from "react-icons/pi";
import { FaArrowTurnDown, FaArrowUp } from "react-icons/fa6";
import { TbArrowMoveDown, TbArrowBigDownLineFilled, TbArrowBigUpLineFilled } from "react-icons/tb";
import { FaArrowRightToBracket, FaArrowRightFromBracket, FaArrowsUpDown, FaArrowDownLong } from "react-icons/fa6";
import { formatAddress, getCampusAbbrWithAddress } from "$/utils/data/school";
import { LuArrowUpDown } from "react-icons/lu";
import { useEffect, useState } from "react";

const CalendarCard: React.FC<CalendarCardProps> = ({ ride, isDriver}) => {

    const [isForth, setIsForth] = useState<boolean>(); 
    const [isOneWay, setIsOneWay] = useState<boolean>();

    useEffect(() => {
        if(ride && ride.status !== "IN_PROGRESS_BACK"){
            setIsForth(true);
        }else{
            setIsForth(false);
        }
    }, [isForth, ride]);

    useEffect(() => {
        if(ride && ride.type === "ALLER"){
            setIsOneWay(true);
        }else{
            setIsOneWay(false);
        }
    }, [isOneWay, ride]);

    if(ride){
        return (
        <div className="flex flex-row justify-between w-max border-gray-300">
          <div className='flex flex-col mx-auto items-center flex-start'>
            <div className="flex flex-row items-center">
                <div className="relative flex flex-row">
                    {isDriver ? (
                        <FaCar className=' text-center my-auto text-gray-600 md:h-[30px] h-[25px] md:w-[30px] w-[25px] mr-1' />
                    ):(
                        <PiSeatbeltFill className=' text-center my-auto text-gray-600 md:h-[30px] h-[25px] md:w-[30px] w-[25px] mr-1' />
                    )}
                    {isForth ? (
                        <FaArrowRightFromBracket className='text-gray-500 md:h-[30px] h-[25px] md:w-[30px] w-[25px] mr-4 ' />
                    ):(
                        <FaArrowRightToBracket className='text-gray-500 md:h-[30px] h-[25px] md:w-[30px] w-[25px] mr-4 ' />
                    )}
                </div>
                <div className="">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-[14px] text-left">{formatAddress(ride.departure)}</h3>
                        {isOneWay ? (
                            <div className="flex flex-row items-center mx-auto">
                                <TbArrowBigDownLineFilled className='text-gray-700 ml-2  h-[25px] w-[25px]' />
                            </div>
                        ):(
                            <div className="flex flex-row items-center mx-auto">
                                <TbArrowBigDownLineFilled className='text-gray-700 h-[25px] w-[25px]' />
                                <TbArrowBigUpLineFilled className='text-gray-700 h-[25px] w-[25px]' />
                            </div>    
                        )}
                    </div>
                    <h3 className=" font-bold text-[14px] text-left">{getCampusAbbrWithAddress(ride.destination)}</h3>
                </div> 
            </div>     
          </div>
        </div>
        );
    }
    
 };

export default CalendarCard;