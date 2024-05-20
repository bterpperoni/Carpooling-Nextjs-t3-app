import { formatAddress } from "$/utils/data/school";
import { FaCircle, FaClock } from "react-icons/fa";
import { FaCircleDot, FaHouseChimney } from "react-icons/fa6";


type CcardProps = {
    address: string | undefined;
    time: Date | undefined;
    children?: React.ReactNode;
    isDestination?: boolean;
}


export default function CalendarCardDetail({address, time, isDestination, children}: CcardProps){
    return(
        <div className="flex flex-col">
          <div className="border-2 border-[var(--pink-g1)] p-2 text-white">
            <div className="">
              <div className="flex flex-row ml-1 items-center mb-2">
                <FaHouseChimney className="h-[2rem] w-[2rem] mr-2 text-[var(--pink-g1)]" />
                <div>
                    {address && formatAddress(address)}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-start">
                  <FaClock className="h-[1.25rem] w-[1.25rem] mb-[3px] mr-2 ml-2 text-[var(--pink-g1)]" />
                  {time?.toLocaleTimeString() ?? "Appuyez pour afficher les détails"}
                </div>
              </div>
            </div>
          </div>
          {!isDestination && (
            <div className="flex flex-col items-center m-1">
              <FaCircleDot className="text-[var(--pink-g1)]" />
                <div className="border-l-4 border-[var(--pink-g1)] border-dashed h-12"></div>
              <FaCircle className="text-[var(--pink-g1)]" />
            </div>
          )}
        </div>
    )
}