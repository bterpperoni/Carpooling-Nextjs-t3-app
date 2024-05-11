
import type { CalendarCardProps } from "$/lib/types/types";
import { FaCar} from "react-icons/fa";
import { CgArrowLongDownE, CgArrowLongUpE } from "react-icons/cg";
import { PiSeatbeltFill } from "react-icons/pi";
import { FaArrowRightToBracket, FaArrowRightFromBracket } from "react-icons/fa6";
import { formatAddress, getCampusAbbrWithAddress } from "$/utils/data/school";

const CalendarCard: React.FC<CalendarCardProps> = ({ ride, isDriver, isForth, isOneWay }) => { 

    if(ride){
        return (
        <div className="flex flex-row justify-between w-max border-y-2 border-gray-300">
          <div className='flex flex-col items-center flex-start'>
            <div className="flex flex-row items-center">
                <div className="relative top-3 flex flex-row">
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
                <h3 className="font-bold text-[14px] text-left">{formatAddress(ride.departure)}</h3>
                {isOneWay ? (
                    <CgArrowLongDownE className=' md:h-[30px] h-[16px] md:w-[30px] w-[16px]' />
                ):(
                    <div className="flex flex-row items-center relative top-3">
                        <CgArrowLongDownE className='text-gray-700 ml-2  h-[30px] w-[30px]' />
                        <CgArrowLongUpE className='text-gray-700 relative right-4  h-[30px] w-[30px]' />
                    </div>
                    
                )}
            </div> 
            <h3 className="font-bold text-[14px] text-right">{getCampusAbbrWithAddress(ride.destination)}</h3>
          </div>
        </div>
        );
    }
    
 };

export default CalendarCard;