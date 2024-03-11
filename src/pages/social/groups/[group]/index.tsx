import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import LayoutMain from '$/lib/components/layout/LayoutMain';
import { useState } from "react";
import GroupForm from "$/lib/components/form/GroupForm";
import { getCampusAbbr } from "$/utils/data/school";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display a specifig group ----------------------------------------------------------------  
------------------------------------------------------------------------------------------------------------------------ */
export default function Group() {
// State
    // Session recovery
    const { data: sessionData } = useSession();
    // Get group id from url 
    const { query, push } = useRouter();
    const id = query.group;
    // Get group by id
    const {data: group} = api.group.groupById.useQuery({id: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    // Get trips by group id
    const {data: rides} = api.ride.rideByGroup.useQuery({groupId: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    // State to display informations about the group
    const [isInfos, setIsInfos] = useState(false);
    // Get group members
    const {data: members} = api.groupMember.groupMemberListByGroup.useQuery({groupId: parseInt(id as string)}, {enabled: sessionData?.user !== undefined});
    // Quit group or exclude group member 
    const { mutate: deleteMemberGroup } = api.groupMember.delete.useMutation();
    // State to display form to update the group
    const [isEditing, setIsEditing] = useState(false);

    // Handlers
    const handleDelete = (id: number) => {
        deleteMemberGroup({id: id});
        setTimeout(() => {
            alert('Vous avez quitté le groupe');
            void push('/social/groups');
        }, 1000);
    }

    const handleExclude = (id: number) => {
        deleteMemberGroup({id: id});
        setTimeout(() => {
            alert('Membre exclu du groupe');
            void push('/social/groups');
        }, 1000);
    }

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
                                    width="30px" height="30px" viewBox="0 0 416.979 416.979">
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
                                        onClick={() => push(`/social/groups/${id as string}/create-ride`)}
                                        className=" bg-[var(--purple-g2)] 
                                                    hover:bg-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-full m-4
                                                    text-3xl">
                                        +
                                    </Button>
                                </div>
                            </div>
                            <div className="border-[var(--purple-g2)] 
                                            border-2 
                                            w-[75vw] 
                                            h-[75vh] 
                                            text-[var(--purple-g2)]
                                            overflow-y-scroll">
                                    {rides?.map((ride) => (
                                        <div key={ride.id} className="border-b-2">
                                            <div className="flex flex-row">
                                                <div className="flex flex-col w-[50%]">
                                                    <div className="m-2">
                                                        <label htmlFor="rideName" className="border-b-[1px] border-[var(--purple-g3)] mr-2 font-bold text-[18px] text-left">
                                                           Départ
                                                        </label>
                                                        <div id="rideName">{ride.departure.split(',')[1]}</div>
                                                    </div>
                                                    <div className="m-2">
                                                        <label htmlFor="rideCampus" className="border-b-[1px] border-[var(--purple-g3)] my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                            Conducteur
                                                        </label>
                                                        <div id="rideCampus">{ride.driverId}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[50%]">
                                                    <div className="m-2">
                                                        <label htmlFor="rideCampus" className="border-b-[1px] border-[var(--purple-g3)] mr-2 font-bold text-[18px] text-left">
                                                            Max. passagers
                                                        </label>
                                                        <div id="rideCampus">{ride.maxPassengers}                   
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        onClick={() => push(`/rides/${ride.id}`)}
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
                                                    <label htmlFor="rideDate" className="my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                        Date
                                                        </label>
                                                    <div id="rideDate">{ride.departureDateTime.toLocaleDateString()} à {ride.departureDateTime.toLocaleTimeString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div> 
                        </div>
                    </div>
                    {/* ------------------------ Display informations -------------------------------------------------------------------- */}
                    {isInfos && (
                        <div className="text-black fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-md px-4 py-2 w-[90vw] h-[90vh] flex items-center flex-col">
                                <div className="flex flex-row justify-between w-full">
                                    <Button
                                        type="button"
                                        onClick={() => setIsInfos(false)}
                                        className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-md">
                                        Retour
                                    </Button>
                                    {group?.createdBy === sessionData.user.name ? (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                        border-2 text-white px-3 py-2 rounded-md">
                                            Modifier
                                        </Button>
                                    ) : null}
                                </div>
                                <div className="w-[80vw] h-[80vh] mt-2">
                                    <div>
                                        <h2 className="text-black border-y-2 border-black w-full m-4">Informations</h2>
                                        <div className="divParent">
                                            <div className="grid grid-cols-2 grid-flow-col">
                                                <div className="">
                                                    <label htmlFor="adminName" className="  border-b-[1px] 
                                                                                            border-[var(--purple-g3)] 
                                                                                            mr-2 
                                                                                            font-bold 
                                                                                            text-[14px]
                                                                                            sm:text-base 
                                                                                            text-left">
                                                    Administrateur
                                                    </label>
                                                    <div id="memberName">{group?.createdBy}</div>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="groupName" className="  border-b-[1px] 
                                                                                            border-[var(--purple-g3)]  
                                                                                            mr-2 
                                                                                            font-bold 
                                                                                            text-[14px] 
                                                                                            sm:text-base
                                                                                            text-left">
                                                    Nom du groupe
                                                    </label>
                                                    <div id="groupName">{group?.name}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 grid-flow-col">
                                                <div>
                                                    <label htmlFor="groupPrivacy" className="   mr-2
                                                                                                font-bold 
                                                                                                text-left 
                                                                                                border-b-[1px] 
                                                                                                text-[14px]
                                                                                                sm:text-base 
                                                                                                border-[var(--purple-g3)]">
                                                        Accessibilité
                                                    </label>
                                                    {group?.visibility ? (
                                                        <div className="" id="groupPrivacy">Public</div>
                                                    ) : (  
                                                        <div className="" id="groupPrivacy">Sur invitation</div>
                                                    )}
                                                </div>
                                                <div className="">
                                                    <label htmlFor="groupMemberCount" className="   border-b-[1px] 
                                                                                                    border-[var(--purple-g3)] 
                                                                                                    mr-2 
                                                                                                    font-bold 
                                                                                                    text-[14px] 
                                                                                                    sm:text-base 
                                                                                                    text-left">
                                                        Destination
                                                    </label>
                                                    <div id="groupMemberCount">{getCampusAbbr(group?.campus ?? '')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                    <div>
                                        <h2 className='text-black border-y-2 border-black w-full mx-2 mt-5 mb-3'>Membres</h2>
                                        {members?.map((member) => (    
                                            <div key={member.id} className="border-b-2">
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col w-[50%]">
                                                        <div className="m-2">
                                                            <div id="memberName">{member.userName}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row w-[50%]">
                                                        <Button 
                                                            onClick={() => push(`/users/${member.userName}/profile`)}
                                                            className=" bg-[var(--purple-g2)] 
                                                                        hover:bg-white 
                                                                        hover:text-[var(--pink-g1)] 
                                                                        border-[var(--pink-g1)] 
                                                                        border-2    
                                                                        text-white 
                                                                        px-3 py-2
                                                                        text-[12px]
                                                                        sm:text-xl 
                                                                        m-2 
                                                                        h-max
                                                                        rounded-md">
                                                            Profil
                                                        </Button>
                                                        {member.userName === sessionData.user.name ? (
                                                            <Button
                                                                onClick={() => handleDelete(member.id)}
                                                                className=" bg-[var(--purple-g2)] 
                                                                            hover:bg-white 
                                                                            hover:text-[var(--pink-g1)] 
                                                                            border-[var(--pink-g1)] 
                                                                            border-2    
                                                                            text-white 
                                                                            px-3 py-2
                                                                            m-2 
                                                                            h-max
                                                                            rounded-md
                                                                            text-[12px]
                                                                            sm:text-xl">
                                                                Quitter
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                {group?.createdBy === sessionData.user.name ? (
                                                                    <Button
                                                                        onClick={() => handleExclude(member.id)}
                                                                        className=" bg-[var(--purple-g2)] 
                                                                                    hover:bg-white 
                                                                                    hover:text-[var(--pink-g1)] 
                                                                                    border-[var(--pink-g1)] 
                                                                                    border-2
                                                                                    text-[12px]
                                                                                    sm:text-xl    
                                                                                    text-white 
                                                                                    px-3 py-2
                                                                                    m-2
                                                                                    h-max
                                                                                    rounded-md">
                                                                        Exclure
                                                                    </Button>    
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}             
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ------------------------ Display form to update group ---------------------------------------------------------- */}
                    {isEditing && group && (
                        <GroupForm cancelButtonHandler={() => setIsEditing(false)} group={group} />
                    )}           
            </LayoutMain>
        </>
    )
else
    return (
        <>
            <LayoutMain>
                    <h1>Not Connected, Please Sign in</h1>
                    <Button 
                        className=" m-4 
                                    rounded-full 
                                    bg-white/10 
                                    px-10 
                                    py-3 
                                    font-semibold 
                                    text-white 
                                    no-underline 
                                    transition 
                                    hover:bg-white/20" 
                        onClick={() => void signIn()}>Sign in</Button>
            </LayoutMain>
        </>
    )
}