/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from "$/lib/components/button/Button";
import Slider from "$/lib/components/button/Slider";
import Dropdown from "$/lib/components/dropdown/Dropdown";
import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { data, getCampus } from "$/utils/data";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";


export default function Groups() {
    // -------------------------------State------------------------------------------------------
    // Create group editing state
    const [isCreating, setIsCreating] = useState(false);
    // School & campus state
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
    // Group name state
    const [groupName, setGroupName] = useState<string>('');
    // Slider state (public/private group)
    const [isPrivate, setisPrivate] = useState<boolean>(false);
    // Session recovery
    const { data: sessionData } = useSession();
    // Get groups
    const { data: groupsData } = api.group.groupList.useQuery(undefined, {
        enabled: sessionData?.user !== undefined
    });
    // Create group
    const { data: createdGroup, mutate: createGroup } = api.group.create.useMutation();

    // ------------------------------- Handlers ------------------------------------------------------
    // Get separated user's school & campus from user's campus field

    useEffect(() => {
        if(createdGroup){
            setTimeout(() => {
                alert('Groupe créé !');
            }, 1000)
        }
    }, [createdGroup])

    // Check if the group is public or private
    const handleCheck = () => {
        setisPrivate(!isPrivate);
    }



    // Save group
    function handleSaveGroup(){
        if(sessionData){
            if (selectedSchool && selectedCampus && groupName) {
                const tmpStrCampus = selectedSchool+'-'+selectedCampus;
                const group = {
                    name: groupName,
                    campus: tmpStrCampus,
                    createdBy: sessionData.user.id,
                    visibility: isPrivate
                }
                createGroup(group);
                setIsCreating(false);
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
                            <p>Gestion des groupes</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <Button 
                                onClick={() => setIsCreating(true)}
                                className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                Créer un groupe
                        </Button>
                    </div>
                    {/* ---------------------------------- Group Card ----------------------------------------- */}
                    <div className="bg-[var(--purple-g3)] w-[85vw] h-[80vh] rounded-[2%]">
                        <table className=" w-full">
                            <thead className="border-y-2">
                                <tr className="text-[var(--pink-g1)] ">
                                    <th className="w-[25%] py-2">Nom du groupe</th>
                                    <th className="w-[25%] py-2">Campus</th>
                                    <th className="w-[25%] py-2">Administrateur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupsData?.map((group) => (
                                    <tr key={group.id} className="text-center cursor-pointer text-white">
                                        <td className="py-2 border-b-2">{group.name}</td>
                                        <td className="py-2 border-b-2">{getCampus(group.campus)}</td>
                                        <td className="py-2 border-b-2">{sessionData.user.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                

                {/* --------------------------------------- Form to create à new group ------------------------------------------- */}
                {isCreating && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-md px-4 py-2">
                            <form>
                                <div className="flex flex-col mb-2">
                                    <Input 
                                        label="Nom du groupe :" 
                                        type="text"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                                        value={groupName}
                                        placeholder="Eg. Les copains de la route"
                                        classInput="mt-2 p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col mb-4 overflow-hidden">
                                    <Dropdown 
                                        data={data} 
                                        onChange={(sc: ChangeEvent<HTMLSelectElement>, ca: ChangeEvent<HTMLSelectElement> ) => {
                                        setSelectedSchool(sc.target.value);
                                        if(sc) setSelectedCampus(ca.target.value);
                                        }} 
                                    />
                                </div>
                                <div className="flex flex-row mb-4 justify-center items-center">
                                    <label className="text-black text-left mr-2">
                                        Privé
                                    </label>
                                    <Slider check={handleCheck} checked={isPrivate} />
                                    <label className="text-black text-left ml-2">
                                        Public
                                    </label>
                                </div>
                                {/* ------------------------------ BUTTON FORM ---------------------------------------------------- */}
                                <div className="flex flex-row justify-between">
                                    <Button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-md">
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={handleSaveGroup}
                                        className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-md">
                                        Créer un groupe
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </LayoutMain>
        );
    }
    return (   
        <LayoutMain>
            <h1>Groups</h1>
            <p>You must be signed in to view this page</p>
        </LayoutMain>
    );
}