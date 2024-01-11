/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from "$/lib/components/button/Button";
import Slider from "$/lib/components/button/Slider";
import Dropdown from "$/lib/components/dropdown/Dropdown";
import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import { data } from "$/utils/data";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";


export default function Groups() {
    // State
    // Create group state
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

    // Handlers
    useEffect(() => {
        console.log('selectedSchool', selectedSchool,selectedCampus);
    }, [selectedCampus, selectedSchool])

    // Check if the group is public or private
    const handleCheck = () => {
        setisPrivate(!isPrivate);
        console.log('isPrivate', isPrivate);
    };

    // Render
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
                    <div className="mt-2">
                        <Button 
                                onClick={() => setIsCreating(true)}
                                className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                Créer un groupe
                        </Button>
                    </div>
                </div>
                {isCreating && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-md px-4 py-2">
                            {/* <h2 className="text-2xl mb-0 text-black border-2">Créer un groupe</h2> */}
                            <form>
                                <div className="flex flex-col mb-2">
                                    <Input 
                                        label="Nom :" 
                                        type="text"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                                        value={groupName}
                                        placeholder="Eg. Les copains de la route"
                                        classInput="mt-2 p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col mb-4">
                                    <Dropdown 
                                        data={data} 
                                        onChange={(sc: ChangeEvent<HTMLSelectElement>, ca: ChangeEvent<HTMLSelectElement> ) => {
                                        setSelectedSchool(sc.target.value);
                                        if(sc) setSelectedCampus(ca.target.value);
                                        }} 
                                    />
                                </div>
                                <div className="flex flex-row mb-4 justify-center items-center">
                                    <label className="text-black text-left">
                                        Privé
                                    </label>
                                    <Slider check={handleCheck} checked={isPrivate} />
                                    <label className="text-black text-left">
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