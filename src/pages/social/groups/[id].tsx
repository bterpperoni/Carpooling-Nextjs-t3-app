import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import { getCampusFullName } from '$/utils/data';
import Button from "$/lib/components/button/Button";
import LayoutMain from '$/lib/components/layout/LayoutMain';
import TravelCard from "$/lib/components/travel/TravelCard";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display a specifig group and its travels ------------------------------------------------  
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

// Render
if(sessionData)
    return (
        <>
            <LayoutMain>
                    <div className="flex justify-center">                    
                        <div className="bg-white w-[90%] h-[85vh] flex flex-col items-center">
                            <div className=" flex flex-row items-center">
                                <div className="border-2 text-white p-3 bg-[var(--purple-g2)] my-2 mx-4">
                                    <h1 className="text-[var(--pink-g0)] flex flex-row justify-center">{group?.name}</h1>
                                </div>
                                <div className="cursor-pointer mx-4">
                                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="30px" height="30px" viewBox="0 0 416.979 416.979">
                                        <g>
                                            <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                                            c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                                            c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                                            c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                                            c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="border-[var(--purple-g2)] border-2 w-[90%] h-[90vh]">
                                <label htmlFor="campusName" className="border-b-2">Destination </label>
                                    <div id="campusName">
                                        {getCampusFullName(group?.campus ?? '')}
                                    </div>
                                    {travels?.map((travel) => (
                                        <TravelCard travel={travel} driver={group?.createdBy} key={travel.id} goToTravel={() => push(`/rides/${travel.id}`)} />

                                        
                                    ))}
                            </div>
                            <Button 
                                onClick={() => push(`/social/groups/rides/${id as string}`)}
                                className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                    Publier un trajet pour ce groupe
                            </Button>
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