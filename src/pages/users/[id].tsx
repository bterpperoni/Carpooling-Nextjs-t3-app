'use client';
import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, useState } from "react";


export default function User() {


  // a Hook is a function that lets you tap into a React feature like state or lifecycle methods
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');

  const { query, reload } = useRouter();
  const id = query.id as string;


  // Session recovery
  const { data: sessionData } = useSession();

  // Get user by id
  const {data: user} = api.user.userById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});

  // Update user
  const { data: updatedUser, error, isLoading, mutate: updateUser } = api.user.update.useMutation();

  const handleEditClick = () => {
    setIsEditing(true);
    if(user?.name && user?.email) {
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
  };

  const handleSaveClick = async () => {

    if (user?.id && editedName && editedEmail) {
        updateUser({
          id: user.id,
          name: editedName,
          email: editedEmail
      });
      setIsEditing(false);
    }
    await(new Promise(r => setTimeout(r, 500)));
    reload();

  };

  if (user){
        return (
          <>
          <LayoutMain>
            <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
              <div className="flex items-center">
                <img className="w-18 h-18 rounded-full mr-6" src={sessionData?.user.image} alt="Profile" />
                <div className="">
                  <div className="text-3xl text-gray-600 md:text-3xl text-left mb-2">
                    {isEditing ? (
                      <Input
                        label=""
                        type="text"
                        value={editedName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                        placeholder="Votre nom"
                      />
                    ) : (
                      user.name
                    )}
                  </div>
                  <div className="text-2xl text-gray-600 md:text-3xl text-left mb-2 mr-3">
                    {isEditing ? (
                      <Input
                      label=""
                      type="email"
                      value={editedEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedEmail(e.target.value)}
                      placeholder="Votre email"
                      />
                    ) : (
                      user.email
                    )}
                  </div>
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
      <LayoutMain>
            <h1>Not Connected, <p>Please Sign in</p></h1> 
      </LayoutMain> 
    </>
  );
}
