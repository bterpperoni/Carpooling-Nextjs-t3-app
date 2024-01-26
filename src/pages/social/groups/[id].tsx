import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import LayoutMain from '$/lib/components/layout/LayoutMain';
import { useState } from "react";

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
    // State to display informations about the group
    const [isInfos, setIsInfos] = useState(false);
    // Get group members
    const {data: members} = api.groupMember.groupMemberListByGroup.useQuery({groupId: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
// Render
if(sessionData)
    return (
        <>
            <LayoutMain>
                    <div className="flex justify-center">                    
                        <div className="bg-white w-[90vw] h-max pb-8 flex flex-col items-center">
                            <div className=" flex flex-row items-center">
                                <div    className="cursor-pointer mx-4 rounded-full border-2 border-black p-2 hover:border-[var(--pink-g1)]"
                                        onClick={() => setIsInfos(true)}>
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
                                                        <div id="travelCampus"> + Status : fonctionnalité de participation                    
                                                        </div>
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
                    {isInfos && (
                        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-md px-4 py-2 w-[90vw] h-[90vh] flex items-center flex-col">
                                <Button
                                    type="button"
                                    onClick={() => setIsInfos(false)}
                                    className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                border-2 text-white px-3 py-2 rounded-md">
                                    Retour
                                </Button>
                                <div className="w-[80vw] h-[80vh] border-2 border-black mt-2">
                                    <h2 className='text-black border-y-2 border-black w-max m-2'>Membres du groupe</h2>
                                    {members?.map((member) => (    
                                        <div key={member.id} className="border-b-2">
                                            <div className="flex flex-row">
                                                <div className="flex flex-col w-[50%]">
                                                    <div className="m-2">
                                                        <label htmlFor="travelName" className="border-b-[1px] border-[var(--purple-g3)] mr-2 font-bold text-[18px] text-left">
                                                           Nom
                                                        </label>
                                                        <div id="travelName">{member.userName}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row w-[50%]">
                                                    <Button 
                                                        onClick={() => push(`/users/${member.userName}`)}
                                                        className=" bg-[var(--purple-g2)] 
                                                                    hover:bg-white 
                                                                    hover:text-[var(--pink-g1)] 
                                                                    border-[var(--pink-g1)] 
                                                                    border-2    
                                                                    text-white 
                                                                    px-3 py-2
                                                                    m-2 
                                                                    rounded-md">
                                                        Voir le profil
                                                    </Button>
                                                    {}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>   
                    )}                    
                    
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