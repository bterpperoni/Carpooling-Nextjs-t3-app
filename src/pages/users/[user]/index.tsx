/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @next/next/no-img-element */
import Input from "$/lib/components/form/Input";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Dropdown from '$/lib/components/dropdown/Dropdown';
import { data } from "$/utils/data/school";
import Button from "$/lib/components/button/Button";
import { UserRole } from "@prisma/client";
import { Loader } from "@googlemaps/js-api-loader";
import Error from "next/error";
import Autocomplete from "react-google-autocomplete";

export default function User() {
  // Get user id from url 
  const { query } = useRouter();
  const name = query.user as string;
  // Session recovery
  const { data: sessionData } = useSession();
  // Get user by id
  const {data: user} = api.user.userByName.useQuery({name: name}, {enabled: sessionData?.user !== undefined});
  /* -------------------------------- User's data & handler -------------------------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');
  const [editedAddress, setEditedAddress] = useState<string>('');

  // Load the Google Maps API
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load the Google Maps API when the component is mounted
  useEffect(() => {
    if (!apiKey) throw new Error({ title: "API key is not defined", statusCode: 404 });

    // Initialize the loader of the Google Maps API
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      region: "BE",
      retries: 3,
      language: "fr"
    });

    void loader.importLibrary("places").then((google) => {
      if(google === null) throw new Error({ title: "Google Places API not loaded", statusCode: 404 });
      setIsLoaded(true);
    });
  });

   // Options for autocomplete
   const options = {
    componentRestrictions: { country: "be" },
    strictBounds: false,
    types: ["address"],
  };

  // Update user state
  const { data: updatedUser, mutate: updateUser } = api.user.update.useMutation();
  // Enable edit mode & set user data from form fields 
  const handleEditClick = () => {
    setIsEditing(true);
    if(user?.name && user?.email && user?.address) {
      setEditedName(user.name);
      setEditedEmail(user.email);
      setEditedAddress(user.address);
    }
  };
  // Save user data & disable edit mode
  const handleSaveClick = () => {
    if(editedName !== '')
    updateUser({
      id: user?.id ?? '',
      name: editedName ,
      email: editedEmail,
      address: editedAddress,
    });
    setIsEditing(false);
  };
  /* -------------------------------- User's school data & handler -------------------------------- */
  // School & campus state
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [isEditingSchool, setIsEditingSchool] = useState<boolean>(false);
  // Get separated user's school & campus from user's campus field
  const ref = user?.campus?.split('-', 2);
  // Update user's school & campus 
  const { data: updatedSchool, mutate: updateSchool } = api.user.updateSchool.useMutation();
  // Enable edit mode for school & campus & set user's school & campus from dropdown
  const handleEditClickSchool = () => {
    setIsEditingSchool(true);
    if(ref) { 
      setSelectedSchool(ref[0] ?? '');
      setSelectedCampus(ref[1] ?? '');
    }
  };
  // Save school & campus
  const handleSaveClickSchool = () => {
    const tmpStrCampus = selectedSchool+'-'+selectedCampus;
    updateSchool({
      id: user?.id ?? '',
      campus: tmpStrCampus,
    });
    setIsEditingSchool(false);
  };

  // Alert when user is updated 
  useEffect(() => {
    if (updatedUser ?? updatedSchool ) {
      alert("Vos informations ont bien été modifiés!");
      window.location.assign(`/users/${editedName !== '' ? editedName : user?.name}/`);
    }
  }, [ updatedSchool, updatedUser]);

  if (sessionData?.user){
    if(user) {
        return (
        <>
          <LayoutMain>
            <div className="w-[90vw] h-auto mx-auto mt-8 bg-white p-8 rounded shadow-md">
              <div className="flex flex-col items-center">
                <img
                  className="w-18 h-18 rounded-full" 
                  src={user?.image ?? '/images/default-profile.png'} 
                  alt="Profile"
                />
                  <div className="text-left overflow-hidden">
                  <div className="max-w-md overflow-hidden mx-auto mt-4 p-4 border rounded-md shadow-md bg-white">
                    {!isEditing ? (
                      <>
                        <div className="mt-4 flex flex-col items-center">
                          <label htmlFor="username" className="w-full text-center border-b-2 text-xl md:text-2xl text-black">Username :</label>
                          <div id="username" className="mt-1">
                            {editedName ? editedName : user.name}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <label htmlFor="email" className="w-full text-center border-b-2 text-xl md:text-2xl text-black">Email :</label>
                          <div id="email" className="mt-1">
                            {editedEmail ? editedEmail : user.email}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <label htmlFor="address" className="w-full text-center border-b-2 text-xl md:text-2xl text-black">Email :</label>
                          <div id="address" className="mt-1">
                            {editedAddress ? editedAddress : user.address}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Input
                          label="Username :"
                          type="text"
                          value={editedName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                          placeholder="Votre nom"
                          classInput="mt-2"
                        />
                        <Input
                          label="Email :"
                          type="email"
                          value={editedEmail}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedEmail(e.target.value)}
                          placeholder="Votre email"
                          classInput="mt-2"
                        />
                        {isLoaded && (
                          <Autocomplete
                          defaultValue={user.address ?? ''}
                          apiKey={apiKey}
                          options={options}
                          onPlaceSelected={(place) => {
                            if(place.formatted_address !== undefined)
                            setEditedAddress(place.formatted_address);
                            console.log("Destination: ", place);
                          }}
                          className="my-2 
                                    w-[75%] 
                                    border-2
                                    border-[var(--purple-g1)] bg-[var(--purple-g3)]
                                    p-2
                                    text-xl 
                                    text-white 
                                    md:w-[75%] md:text-2xl"
                          id="destination"
                        />
                    )}
                      </>
                    )}
                    </div>
                  </div>
              </div>
              <div className="mt-4 flex justify-center">
                {sessionData.user.name === user.name ? (
                  <>
                    {isEditing ? (
                      <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSaveClick}>
                        Enregistrer
                      </Button>
                    ) : (
                      <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleEditClick}>
                        Modifier mes informations
                      </Button>
                    )}
                  </>
                  ) : null
                }
              </div>

              <div className="mt-8 mb-4">
                  {isEditingSchool ? (
                     <Dropdown 
                        data={data} 
                        styleDropdown="max-w-md mx-auto mt-4 p-4 border rounded-md shadow-md bg-white"
                        colorLabel='text-gray-600'
                        onChange={(sc: ChangeEvent<HTMLSelectElement>, ca: ChangeEvent<HTMLSelectElement> ) => {
                          setSelectedSchool(sc.target.value);
                          setSelectedCampus(ca.target.value);
                        }} 
                     />
                  ) : (
                    <div className="text-center max-w-md mx-auto mt-4 p-4 border rounded-md shadow-md bg-white">
                      <div className="mb-4">
                        <p className="border-b-2 font-medium text-gray-600 text-xl md:text-2xl">Etablissement :</p>
                        <p className="text-base">
                          {
                            data.school.find((school) => school.reference === (ref ?? [])[0])?.name ?? (ref?.[0] ?? '')
                          }
                        </p>
                      </div>
                      <div>
                        <p className="border-b-2 font-medium text-gray-600 text-lg md:text-xl">Campus :</p>
                        <p className="text-base">
                          {
                            data.school.find((school) => school.reference === (ref ?? [])[0])
                            ?.campus?.find((campus) => campus.campus_ref === ref?.[1])?.campus_name ?? (ref?.[1] ?? '')
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center">
                    {sessionData.user.id === user.id ? (
                      <>
                        {isEditingSchool ? (
                          <Button 
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleSaveClickSchool}
                          >
                          Enregistrer
                          </Button>
                      ) : (
                          <Button 
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleEditClickSchool}  
                          >
                          Changer mon établissement par défaut
                          </Button>
                      )}
                    </>
                    ) : null
                  }
                  </div>
              </div>
              <div className="admin">
                {sessionData.user.role === UserRole.ADMIN.toString() && name === sessionData.user.name ? (
                  <div className="mt-4 border-2 border-black flex items-center flex-col">
                    <h2 className="text-xl text-black font-bold">
                      Options supplémentaires pour les administrateurs
                    </h2>
                    <div className="mt-4">
                      <Button 
                          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md m-2"
                          onClick={() => window.location.assign(`/users/`)}>
                              Voir la liste des utilisateurs
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </LayoutMain> 
        </>
      );
    }
  }
  return (
    <>
      <LayoutMain>
            <h1>Not Connected, <p>Please Sign in</p></h1> 
      </LayoutMain> 
    </>
  );
}
