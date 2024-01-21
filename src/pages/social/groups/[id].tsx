import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import LayoutMain from '$/lib/components/layout/LayoutMain';
import { useState } from "react";
import { Travel } from "@prisma/client";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display a specifig group ----------------------------------------------------------------  
------------------------------------------------------------------------------------------------------------------------ */
export default function Group() {
// State
    // Session recovery
    const { data: sessionData } = useSession();
    // Get group id from url 
    const { query, push } = useRouter();
    const id = query.id;
    // Get group by id
    const {data: group} = api.group.groupById.useQuery({id: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    // Get trips by group id
    const {data: travels} = api.travel.travelByGroup.useQuery({groupId: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    
    // Handlers
    // Departure abbreviation state
    const departureAbbrList = useState<string[] | string | undefined>([]);

    const departureAbbrReducer = (state: { id: number; isForGroup: boolean; groupId: number | null; driverId: string; departure: string; departureLatitude: number; departureLongitude: number; departureDateTime: Date; destination: string; destinationLatitude: number; destinationLongitude: number; returnDateTime: Date | null; maxPassengers: number | null; status: number; }[], action: { type: string; }) => {
        switch (action.type) {
            case 'ABBREVIATE':
                return state.map((travelDeparture: Travel) => {
                    return 
                });
            default:
                return state;
        }
    }

    travels?.forEach((travel) => {
        const stringDep = travel.departure.split(',');
        console.log(stringDep[1]);
        departureAbbrList.push(stringDep[1]);
    });
    console.log([...departureAbbrList])


// Render
if(sessionData)
    return (
        <>
            <LayoutMain>
                    <div className="flex justify-center">                    
                        <div className="bg-white w-[90vw] h-max pb-8 flex flex-col items-center">
                            <div className=" flex flex-row items-center">
                                <div className="cursor-pointer mx-4">
                                {/* ---------------------------------------------- Icon infos ----------------------------------------------------- */}
                                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="40px" height="40px" viewBox="0 0 416.979 416.979">
                                        <g>
                                            <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                                            c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                                            c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                                            c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                                            c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                                        </g>
                                    </svg>
                                {/* ------------------------------------------------------------------------------------------------- */}
                                </div>
                                <div className="border-2 text-white p-3 bg-[var(--purple-g2)] my-2 mx-4">
                                    <h1 className="text-white text-base flex flex-row justify-center sm:text-xl">{group?.name}</h1>
                                </div>
                                <div>
                                    <Button 
                                        onClick={() => push(`/social/groups/rides/${id as string}`)}
                                        className=" bg-[var(--purple-g2)] 
                                                    hover:bg-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-full m-4
                                                    text-3xl">
                                        {/* Publier un trajet pour ce groupe */} +
                                    </Button>
                                </div>
                            </div>
                            <div className="border-[var(--purple-g2)] 
                                            border-2 
                                            w-[75vw] 
                                            h-[75vh] 
                                            text-[var(--purple-g2)]
                                            overflow-y-scroll">
                                    {travels?.map((travel) => (
                                        <div key={travel.id} className="border-b-2">
                                            <div className="flex flex-row">
                                                <div className="flex flex-col w-[50%]">
                                                    <div className="m-2">
                                                        <label htmlFor="travelName" className="border-b-[1px] border-[var(--purple-g3)] mr-2 font-bold text-[18px] text-left">
                                                           Départ
                                                        </label>
                                                        <div id="travelName">{travel.departure.split(',')[1]}</div>
                                                    </div>
                                                    <div className="m-2">
                                                        <label htmlFor="travelCampus" className="border-b-[1px] border-[var(--purple-g3)] my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                            Conducteur
                                                        </label>
                                                        <div id="travelCampus">{travel.driverId}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[50%]">
                                                    <div className="m-2">
                                                        <label htmlFor="travelCampus" className="border-b-[1px] border-[var(--purple-g3)] mr-2 font-bold text-[18px] text-left">
                                                            Participants
                                                        </label>
                                                        <div id="travelCampus">(en dur) 2 taken on 3 places</div>
                                                    </div>
                                                    <Button 
                                                        onClick={() => push(`/rides/${travel.id}`)}
                                                        className=" bg-[var(--purple-g2)] 
                                                                hover:bg-white 
                                                                hover:text-[var(--pink-g1)] 
                                                                border-[var(--pink-g1)] 
                                                                border-2    
                                                                text-white 
                                                                px-3 py-2
                                                                m-2 
                                                                rounded-md">
                                                        Voir le trajet
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-between">
                                                <div className="m-2">
                                                    <label htmlFor="travelDate" className="my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                        Date
                                                        </label>
                                                    <div id="travelDate">{travel.departureDateTime.toLocaleDateString()} à {travel.departureDateTime.toLocaleTimeString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div> 
                        </div>
                    </div>
            </LayoutMain>
        </>
    )
else
    return (
        <>
            <LayoutMain>
                <div>
                    <h1>Group</h1>
                    <div>
                        <h1>Not logged in</h1>
                    </div>
                </div>
            </LayoutMain>
        </>
    )
}