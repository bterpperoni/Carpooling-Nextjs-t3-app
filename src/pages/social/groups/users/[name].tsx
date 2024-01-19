import LayoutMain from '$/lib/components/layout/LayoutMain';
import { api } from '$/utils/api';
import { getCampusAbbr } from '$/utils/data';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function UserGroup() {

    const { data: sessionData } = useSession();

    const { query } = useRouter();
    const name = query.name as string;

    const { data: userGroups } = api.group.groupListByUser.useQuery({name: name}, {enabled: sessionData?.user !== undefined});

    console.log(userGroups);

    if(sessionData) 
    return (
        <>
            <LayoutMain>
                <div className='m-4'>
                    <div className='md:text-2xl text-xl mx-12 bg-[var(--purple-g3)] text-center 
                                        rounded-[5%] p-4 text-fuchsia-700 border-fuchsia-700 border-y-2'>                    
                            <p>Mes groupes</p>
                        </div>
                </div>
                <div>
                {userGroups?.map((group) => (
                                    <div key={group.id} className=" border-y-2 
                                                                    text-[var(--pink-g1)] 
                                                                    cursor-pointer 
                                                                    hover:bg-[var(--pink-g1)] 
                                                                    hover:text-white p-6"
                                                        onClick={() => window.location.href = `/social/groups/${group.id}`}>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-[50%]">
                                                <div className="mb-4 cursor-pointer">
                                                    <label htmlFor="groupName" className="mr-2 font-bold text-[18px] text-left">
                                                        Nom du groupe 
                                                    </label>
                                                    <div id="groupName">{group.name}</div>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="groupPrivacy" className="my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                        Visibilité
                                                    </label>
                                                    {group.visibility ? (
                                                        <div>Privé</div>
                                                    ) : (  
                                                        <div>Public</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-[50%]">
                                                <div className="mb-4">
                                                    <label htmlFor="groupCampus" className="mr-2 font-bold text-[18px] text-left">
                                                        Destination
                                                    </label>
                                                    <div>{getCampusAbbr(group.campus)}</div>
                                                </div>
                                                <div className="flex-col flex">
                                                    <label htmlFor="groupCreatedBy" className="w-max my-auto font-bold text-base text-left border-b-[1px] border-[var(--purple-g3)]">
                                                        Groupe créé par
                                                    </label>
                                                    <div>{group.createdBy}</div>
                                                </div>
                                            </div>
                                        </div>   
                                    </div>
                                ))}
                </div>
            </LayoutMain>

        </>
    );
}