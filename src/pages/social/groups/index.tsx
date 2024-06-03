/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from "$/lib/components/button/Button";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { getCampusAbbrWithFullName  } from "$/utils/data/school";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import type { Group } from "@prisma/client";
import GroupForm from "$/lib/components/form/GroupForm";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display all groups and search for a specific group --------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function Groups() {
    // Create group editing state
    const [isCreating, setIsCreating] = useState(false);

    // Session recovery
    const { data: sessionData } = useSession();
    // Get groups
    const { data: groupsData } = api.group.groupList.useQuery(undefined, {
        enabled: sessionData?.user !== undefined
    });

    // Group list by user
    const { data: userGroups } = api.groupMember.groupMemberListByUser.useQuery(
        { userName: sessionData?.user.name ?? '' },
        { enabled: sessionData?.user !== undefined }
    );
    // Join group
    const { mutate: createMemberGroup } = api.groupMember.create.useMutation();

    // Get router
    const router = useRouter();
    
    // ------------------------------- Handlers ------------------------------------------------------

    // Join group
    function joinGroup(gr: Group){
        if(sessionData){
            if(gr.visibility){
                const groupMember = {
                    userName: sessionData.user.name,
                    groupId: gr.id,
                    validated: true
                }
                createMemberGroup(groupMember);
                setTimeout(() => {
                    alert("Groupe rejoind avec succès !")
                    router.reload();
                }, 1000)
            }else{
                const groupMember = {
                    userName: sessionData.user.name,
                    groupId: gr.id,
                    validated: false
                }
                createMemberGroup(groupMember);
                setTimeout(() => {
                    alert("Demande pour rejoindre le groupe envoyé avec succès !")
                    router.reload();
                }, 1000)
            }
        }
    }
    // ------------------------------- Render ------------------------------------------------------
    if (sessionData) {
        return (
            <LayoutMain>        
                <div className='flex flex-col items-center'>
                    <div className='border-0 m-4'>   
                        <div className='md:text-2xl text-xl mx-12 bg-[var(--purple-g3)] text-center 
                                        rounded-[5%] p-4 text-fuchsia-700 border-fuchsia-700 border-y-2'>                    
                            <p>Trouver un groupe</p>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-row justify-between w-[90%]">
                        <Button 
                                onClick={() => setIsCreating(true)}
                                className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                Créer un groupe
                        </Button>
                        <Button 
                                onClick={() => router.push(`/social/${sessionData.user.name}`)}
                                className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                Mes groupes
                        </Button>
                    </div>
                    
                    <div className="bg-[var(--purple-g3)] w-[85vw] h-[80vh] rounded-[2%]">
                        <div className="">
                            <div className="border-y-2 mb-4">
                                <div className="text-[var(--pink-g0)] flex flex-row justify-center">
                                    <div className="m-6 text-2xl bold text-center">
                                        Trouves des étudiants qui se rendent au même établissement.
                                        <p className="text-xl text-center">
                                            Rejoinds un groupe ou crée le tien!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-2 border-indigo-500">
                            {/* ---------------------------------- Group Card ----------------------------------------- */}
                                {groupsData?.map((group) => (
                                    <div key={group.id} className=" border-y-2 
                                                                    text-[var(--pink-g1)]
                                                                    hover:bg-[var(--pink-g1)] 
                                                                    hover:text-white p-6">
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-[50%]">
                                                <div className="mb-4">
                                                    <label htmlFor="groupName" className="mr-2 font-bold text-[18px] text-left">
                                                        Nom du groupe 
                                                    </label>
                                                    <div id="groupName" className="text-white">{group.name}</div>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="groupPrivacy" className="my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                        Accessibilité
                                                    </label>
                                                    {!group.visibility ? (
                                                        <div className="text-white">Sur invitation</div>
                                                    ) : (  
                                                        <div className="text-white">Public</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-[50%]">
                                                <div className="mb-4 ml-2">
                                                    <label htmlFor="groupCampus" className="mr-2 font-bold text-[18px] text-left">
                                                        Destination
                                                    </label>
                                                    <div className="text-white">{getCampusAbbrWithFullName(group.campus)}</div>
                                                </div>
                                                <div className="flex-col flex">
                                                    {userGroups?.find((userGroup) => userGroup.groupId === group.id) ? (
                                                        <div className="flex flex-col">
                                                            {userGroups.find((userGroup) => userGroup.groupId === group.id && userGroup.validated
                                                            ) ? (
                                                                <Button 
                                                                    onClick={() => router.push(`/social/groups/${group.id}`)}
                                                                    className=" bg-[var(--purple-g3)] 
                                                                            hover:bg-white 
                                                                            hover:text-[var(--pink-g1)] 
                                                                            border-[var(--pink-g1)] 
                                                                            border-2    
                                                                            text-white 
                                                                            px-3 py-2 
                                                                            rounded-md">
                                                                Voir le groupe
                                                                </Button>
                                                            ) : (
                                                             <p className=" text-white
                                                                            px-3 py-2
                                                                            rounded-md
                                                                            border-2
                                                                            border-[var(--pink-g1)]
                                                                            bg-[var(--purple-g3)]
                                                                            text-center
                                                                            cursor-not-allowed">
                                                                Demande en attente..
                                                            </p>   
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                                <Button 
                                                                    onClick={() => joinGroup(group)}
                                                                    className=" bg-[var(--purple-g3)] 
                                                                                hover:bg-white 
                                                                                hover:text-[var(--pink-g1)] 
                                                                                border-[var(--pink-g1)] 
                                                                                border-2    
                                                                                text-white 
                                                                                px-3 py-2 
                                                                                rounded-md">
                                                                Rejoindre le groupe
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>    
                                            </div>
                                        </div>   
                                    </div>
                                ))}
                            {/* ---------------------------------- /Group Card ----------------------------------------- */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* --------------------------------------- Form to create à new group ------------------------------------------- */}
                {isCreating && (
                    <GroupForm cancelButtonHandler={() => {setIsCreating(false)}} />
                )}
            </LayoutMain>
        );
    }
    return (   
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
    );
}