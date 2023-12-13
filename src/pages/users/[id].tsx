import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";


export default function User() {
const { query } = useRouter();
  const id = query.id as string;
  const { data: sessionData } = useSession();

  const { data: userList } = api.user.userList.useQuery(undefined,
    { enabled: sessionData?.user !== undefined }  
    );

    console.log(userList);

  if (userList){
        return (
          <>
          <LayoutMain>
            <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
              <div className="flex items-center">
                <img className="w-16 h-16 rounded-full mr-4" src={sessionData?.user.image} alt="Profile" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{sessionData?.user.name}</h1>
                  <p className="text-gray-600">{sessionData?.user.email}</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">Statistiques</h2>
                  <p className="border-t-2 border-b-0 border-l-0 border-r-0 border-black">Nombre de trajets : 0</p>
                  <p className="border-t-2 border-b-0 border-l-0 border-r-0 border-black">Montant du portefeuille : 0</p>
                  <p className="border-t-2 border-b-0 border-l-0 border-r-0 border-black">Note moyenne : 0/5</p>
                </div>

                {/* Ajoutez d'autres sections de profil en fonction de vos besoins */}
              </div>
            </div>
          </LayoutMain> 
      </>
    );
  }
  return (
    <>
      <h1>Not Connected</h1>      
    </>
  );
  
};
