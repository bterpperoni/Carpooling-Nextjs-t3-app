import { formatAddress } from "$/utils/data/school";
import { FaCircle, FaClock } from "react-icons/fa";
import { FaCircleDot, FaHouseChimney } from "react-icons/fa6";
import { RiSchoolFill } from "react-icons/ri";


type CcardProps = {
    address: string;
    time: string;
    children?: React.ReactNode;
}


export default function Ccard({address, time, children}: CcardProps): JSX.Element{
    return(
        <div className="flex flex-row justify-center">
          <div className="flex flex-col items-center mt-4">
            <FaCircleDot className="text-[var(--pink-g1)]" />
                <div className="border-l-4 border-[var(--pink-g1)] border-dashed h-24"></div>
            <FaCircle className="text-[var(--pink-g1)]" />
          </div>
          <div className="pb-2 m-2 text-white">
            <div className="mb-11">
              <div className="flex flex-row ml-1 items-center mb-2">
                <FaHouseChimney className="h-[2rem] w-[2rem] mr-2 text-[var(--pink-g1)]" />
                <div>
                    {formatAddress(address)}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-center">
                  <FaClock className="h-[1.25rem] w-[1.25rem] mb-[3px] mr-2 text-[var(--pink-g1)]" />
                  {time}
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
    )
}