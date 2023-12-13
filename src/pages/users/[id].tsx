import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, useState } from "react";


export default function User() {


  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');

  const { query } = useRouter();
  const id = query.id as string;


  const { data: sessionData } = useSession();

  const {data: user} = api.user.userById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});

  // const { data: userList } = api.user.userList.useQuery(undefined,
  //   { enabled: sessionData?.user !== undefined }  
  //   );

  const { data: updatedUser, error, isLoading, mutate: updateUser } = api.user.update.useMutation();

  console.log(user);

  const handleEditClick = () => {
    if(user?.name && user?.email) {
      setIsEditing(true);
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
    
  };

  const handleSaveClick = () => {
    // Mettez en œuvre la logique pour sauvegarder les modifications dans votre application
    // Dans cet exemple, nous mettons simplement à jour l'état local avec les nouvelles valeurs
    if (user?.id && editedName && editedEmail) {
      updateUser({
          id: user.id,
          name: editedName,
          email: editedEmail
      });
    setIsEditing(false);
    }
    
  };

  if (user){
        return (
          <>
          <LayoutMain>
            <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
              <div className="flex items-center">
                <img className="w-18 h-18 rounded-full mr-6" src={sessionData?.user.image} alt="Profile" />
                <div className="">
                  <h1 className="text-2xl font-bold text-gray-800 md:text-4xl text-left">
                    {isEditing ? (
                      <Input
                        label="Nom"
                        type="text"
                        value={editedName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                        placeholder="Votre nom"
                      />
                   
                    ) : (
                      user.name
                    )}
                  </h1>
                  <p className="text-gray-600 md:text-3xl text-left">
                    {isEditing ? (
                      <Input
                      label="Email"
                      type="email"
                      value={editedEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedEmail(e.target.value)}
                      placeholder="Votre email"
                    />
                    ) : (
                      user.email
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                {isEditing ? (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSaveClick}
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleEditClick}
                  >
                    Modifier
                  </button>
                )}
              </div>

              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">Statistiques</h2>
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
