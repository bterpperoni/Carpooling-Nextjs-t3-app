/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from "$/lib/components/button/Button";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { userRole } from "$/lib/types/enums";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";


export default function UsersList() {

    const { data: sessionData } = useSession();
    const { data: users } = api.user.userList.useQuery(undefined, {enabled: sessionData?.user !== undefined});
    const { mutate: deleteUser } = api.user.delete.useMutation();


    if(sessionData?.user.role !== userRole.ADMIN) 
    return (
        <LayoutMain>
            <div className="text-white m-6 text-3xl m-4 w-screen text-center">
                You are not allowed to access this page
                <p>because you are a {sessionData?.user.role}</p>
            </div>
        </LayoutMain>
    );
    return (
        <LayoutMain>
            <div className="flex flex-col items-center">
                <h2 className=" md:text-4xl 
                                text-2xl 
                                font-bold 
                                mb-4 mt-4  
                                w-[fit-content]
                                text-center 
                                text-white
                                border-y-2
                                border-fuchsia-700
                                p-4
                                rounded-[12.5%]">
                    Liste des utilisateurs
                </h2>
                <div className="flex flex-col items-center">
                    {users?.map((user: User) => (
                        <div key={user.id} className="flex flex-col items-center bg-white/10 rounded-md p-4 m-4">
                            <div className="flex flex-col items-center">
                                <h3 className="text-white text-2xl font-bold">Nom: {user.name}</h3>
                                <p className="text-white text-lg">Email: {user.email}</p>
                                <p className="text-white text-lg">Campus: {user.campus}</p>
                                <p className="text-white text-lg">Rôle: {user.role}</p>
                            </div>
                            <div className="flex flex-row items-center">
                                <Button 
                                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md m-2"
                                    onClick={() => window.location.assign(`/users/${user.name}/profile`)}>
                                        Profile
                                </Button>
                                <Button 
                                    className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md m-2" 
                                    onClick={() => deleteUser({id: user.id})}>
                                        Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </LayoutMain>
    );
}