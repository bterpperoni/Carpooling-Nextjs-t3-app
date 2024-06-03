/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Input from '$/lib/components/form/Input';
import Button from '$/lib/components/button/Button';
import Dropdown from '$/lib/components/dropdown/Dropdown';
import Slider from '$/lib/components/button/Slider';
import type { ChangeEvent } from "react";
import type { Group } from '@prisma/client';
import { data } from '$/utils/data/school';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '$/utils/api';


export default function GroupForm({ group, cancelButtonHandler }: 
    { 
        group?: Group,
        cancelButtonHandler: () => void
    }) { 
    
    // School & campus state
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
    // Group name state
    const [groupName, setGroupName] = useState<string>(group?.name ?? '');
    // Slider state (public/private group)
    const [isPrivate, setisPrivate] = useState<boolean>(group?.visibility ?? false);
    // Session recovery
    const { data: sessionData } = useSession();
    // Create group
    const { data: createdGroup, mutate: createGroup } = api.group.create.useMutation();
    // Update group
    const { data: updatedGroup, mutate: updateGroup } = api.group.update.useMutation();
    // Join group
    const { mutate: createMemberGroup } = api.groupMember.create.useMutation();
    // Check if the group is public or private
    const handleCheck = () => {
        setisPrivate(!isPrivate);
    }
    // Save group
    function handleSaveGroup(){
        if(sessionData){
            if (selectedSchool && selectedCampus && groupName) {
                const tmpDivCampus = selectedSchool+'-'+selectedCampus;
                if(group){
                    updateGroup({
                        id: group.id,
                        name: groupName,
                        campus: tmpDivCampus,
                        createdBy: sessionData.user.name,
                        visibility: isPrivate
                    });
                }else{
                    createGroup({
                        name: groupName,
                        campus: tmpDivCampus,
                        createdBy: sessionData.user.name,
                        visibility: isPrivate
                    });
                }
                
            }
        }
    }

    useEffect(() => {
        if(createdGroup){
            if(sessionData){
                const groupMember = {
                    userName: sessionData.user.name,
                    groupId: createdGroup.id,
                    validated: true
                }
                createMemberGroup(groupMember);
            }
            setTimeout(() => {
                alert('Groupe créé !');
                window.location.reload();
            }, 1000)
        }

        if(updatedGroup){
            setTimeout(() => {
                alert('Groupe modifié !');
                window.location.reload();
            }, 1000)
        }
    }, [createdGroup, updatedGroup])

            return (
                <>
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-md px-4 py-2">
                            <form>
                                <div className="flex flex-col mb-2">
                                    <Input
                                        label="Nom du groupe :" 
                                        type="text"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                                        value={groupName}
                                        placeholder={group?.name ?? 'E.g. : Les copains de la route'}
                                        classInput="mt-2 p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col mb-4 overflow-hidden">
                                    <Dropdown 
                                        data={data}
                                        styleDropdown='max-w-md mx-auto mt-4 p-4 border rounded-md shadow-md bg-white'
                                        colorLabel='text-gray-600'
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
                                    <Slider textLbl='' check={handleCheck} checked={isPrivate} />
                                    <label className="text-black text-left ml-2">
                                        Public
                                    </label>
                                </div>
                            </form>
                            {/* ------------------------------ BUTTON FORM ---------------------------------------------------- */}
                            <div className="flex flex-row justify-between">
                                    <Button
                                        type="button"
                                        onClick={cancelButtonHandler}
                                        className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-md">
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={handleSaveGroup}
                                        className="bg-[var(--purple-g2)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                                    border-2 text-white px-3 py-2 rounded-md">
                                        {group ? "Modifier" : "Créer"}
                                    </Button>
                            </div>
                        </div>
                    </div>
                </>
            );
 };