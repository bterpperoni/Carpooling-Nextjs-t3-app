'use client';
import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, useEffect, useState } from "react";


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
  const { data: updatedUser, mutate: updateUser } = api.user.update.useMutation();

  // Enable edit mode & set user data in form fields 
  const handleEditClick = () => {
    setIsEditing(true);
    if(user?.name && user?.email) {
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
  };

 // Reload page when user is updated 
 useEffect(() => {
    if (updatedUser) {
      reload();
    }
  }, [updatedUser, reload]);

  // Save user data & disable edit mode
  const handleSaveClick = () => {
    updateUser({
      id: id,
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
  };

  if (user && sessionData?.user){
        return (
          <>
          <LayoutMain>
            <div className="w-[90vw] h-auto mx-auto mt-8 bg-white p-8 rounded shadow-md ">
              <div className="flex flex-col items-center md:flex-row ">
                <img className="w-18 h-18 rounded-full mr-6" src={sessionData?.user.image} alt="Profile" />
                  <div className="text-2xl text-gray-600 md:text-4xl lg:text-5xl text-left">
                    {!isEditing ? (
                      <>
                        <div className="ml-2 mt-4">{user.name}</div>
                        <div className="ml-2 mt-4">{user.email}</div>
                      </>
                    ) : (
                      <>
                        <Input
                          label=""
                          type="text"
                          value={editedName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                          placeholder="Votre nom"
                          classInput="ml-2 mt-4"
                        />
                        <Input
                          label=""
                          type="email"
                          value={editedEmail}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedEmail(e.target.value)}
                          placeholder="Votre email"
                          classInput="ml-2 mt-4"
                        />
                      </>
                    )}
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

                {/* Other sections */}
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
