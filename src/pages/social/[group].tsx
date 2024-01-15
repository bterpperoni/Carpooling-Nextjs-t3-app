import { useSession } from "next-auth/react";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import { getCampusFullName } from '../../utils/data';
import Button from "$/lib/components/button/Button";


export default function Group() {
// State
    // Session recovery
    const { data: sessionData } = useSession();
    // Get group id from url 
    const { query } = useRouter();
    const id = parseInt(query.group as string);
    // Get group by id
    const {data: group} = api.group.groupById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});
    
// Handlers



// Render
if(sessionData)
    return (
        <>
            <LayoutMain>
                    <h1 className="text-[var(--pink-g0)] flex flex-row justify-center">{group?.name}</h1>
                    <div className="flex justify-center">                    
                        <div className="bg-white w-[90%] h-[85vh] flex flex-col items-center">
                            <div className=" flex flex-row">
                                <div className="border-2 text-white p-3 bg-[var(--purple-g2)]">
                                    {getCampusFullName(group?.campus ?? '')}
                                </div>
                            </div>
                            <div className="border-[var(--purple-g2)] border-2 w-[90%] h-[100vh]">
                                <p className="text-black text-xl">
                                    Ici la liste des trajets du groupe
                                </p>
                                <p className="text-black text-xl">
                                    Ajouter bouton infos pour liste membres du groupe
                                </p>
                            </div>
                            <Button 
                                onClick={() => alert('Publier un trajet pour ce groupe')}
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
                        <p>Not logged in</p>
                    </div>
                </div>
            </LayoutMain>
        </>
    )
}