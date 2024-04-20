import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useState } from "react";
import GroupForm from "$/lib/components/form/GroupForm";
import { getCampusAbbrWithFullName } from "$/utils/data/school";
import Infos from "$/lib/components/button/Infos";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to display a specifig group ----------------------------------------------------------------  
------------------------------------------------------------------------------------------------------------------------ */
export default function Group() {
  // State
  // Session recovery
  const { data: sessionData } = useSession();
  // Get group id from url
  const { query, push } = useRouter();
  const id = query.group;
  // Get group by id
  const { data: group } = api.group.groupById.useQuery(
    { id: parseInt(id as string) },
    { enabled: sessionData?.user !== undefined },
  );
  // Get trips by group id
  const { data: rides } = api.ride.rideByGroup.useQuery(
    { groupId: parseInt(id as string) },
    { enabled: sessionData?.user !== undefined },
  );
  // State to display informations about the group
  const [isInfos, setIsInfos] = useState(false);
  // Get group members
  const { data: members } = api.groupMember.groupMemberListByGroup.useQuery(
    { groupId: parseInt(id as string) },
    { enabled: sessionData?.user !== undefined },
  );
  // Quit group or exclude group member
  const { mutate: deleteMemberGroup } = api.groupMember.delete.useMutation();
  // State to display form to update the group
  const [isEditing, setIsEditing] = useState(false);

  // Handlers
  const handleDelete = (id: number) => {
    deleteMemberGroup({ id: id });
    setTimeout(() => {
      alert("Vous avez quitté le groupe");
      void push("/social/groups");
    }, 1000);
  };

  const handleExclude = (id: number) => {
    deleteMemberGroup({ id: id });
    setTimeout(() => {
      alert("Membre exclu du groupe");
      void push("/social/groups");
    }, 1000);
  };

  // Render
  if (sessionData)
    return (
      <>
        <LayoutMain>
          <div className="flex justify-center">
            <div className="flex h-max w-[90vw] flex-col items-center bg-white pb-8">
              <div className=" flex flex-row items-center">
                <div
                  className="mx-4 
                                               cursor-pointer rounded-full border-2 
                                               border-black p-2 
                                               hover:border-[var(--pink-g1)]"
                >
                  {/* ---------------------------------------------- Icon infos ----------------------------------------------------- */}
                  <Infos
                    wIcon={30}
                    hIcon={30}
                    handleInfos={() => setIsInfos(true)}
                  />
                  {/* ------------------------------------------------------------------------------------------------- */}
                </div>
                <div className="mx-4 my-2 border-2 bg-[var(--purple-g2)] p-3 text-white">
                  <h1 className="flex flex-row justify-center text-base text-white sm:text-xl">
                    {group?.name}
                  </h1>
                </div>
                <div>
                  <Button
                    onClick={() =>
                      push(`/social/groups/${id as string}/create-ride`)
                    }
                    className=" m-4 
                                                    rounded-full 
                                                    border-2 bg-[var(--purple-g2)] px-3 py-2 text-3xl text-white
                                                    hover:bg-[var(--pink-g1)]"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div
                className="h-[75vh] 
                                            w-[75vw] 
                                            overflow-y-scroll 
                                            border-2 
                                            border-[var(--purple-g2)]
                                            text-[var(--purple-g2)]"
              >
                {rides?.map((ride) => (
                  <div key={ride.id} className="border-b-2">
                    <div className="flex flex-row">
                      <div className="flex w-[50%] flex-col">
                        <div className="m-2">
                          <label
                            htmlFor="rideName"
                            className="mr-2 border-b-[1px] border-[var(--purple-g3)] text-left text-[18px] font-bold"
                          >
                            Départ
                          </label>
                          <div id="rideName">
                            {ride.departure.split(",")[1]}
                          </div>
                        </div>
                        <div className="m-2">
                          <label
                            htmlFor="rideCampus"
                            className="my-auto border-b-[1px] border-b-[1px] border-[var(--purple-g3)] border-[var(--purple-g3)] text-left text-base font-bold"
                          >
                            Conducteur
                          </label>
                          <div id="rideCampus">{ride.driverId}</div>
                        </div>
                      </div>
                      <div className="flex w-[50%] flex-col">
                        <div className="m-2">
                          <label
                            htmlFor="rideCampus"
                            className="mr-2 border-b-[1px] border-[var(--purple-g3)] text-left text-[18px] font-bold"
                          >
                            Max. passagers
                          </label>
                          <div id="rideCampus">{ride.maxPassengers}</div>
                        </div>
                        <Button
                          onClick={() => push(`/rides/${ride.id}`)}
                          className=" m-2 
                                      rounded-md 
                                      border-2 
                                      border-[var(--pink-g1)] 
                                      bg-[var(--purple-g2)]    
                                      px-3 
                                      py-2 text-white
                                      hover:bg-white 
                                      hover:text-[var(--pink-g1)]"
                        >
                          Voir le trajet
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="m-2">
                        <label
                          htmlFor="rideDate"
                          className="my-auto border-b-[1px] border-[var(--purple-g3)] text-left text-base font-bold"
                        >
                          Date
                        </label>
                        <div id="rideDate">
                          {ride.departureDateTime.toLocaleDateString()} à{" "}
                          {ride.departureDateTime.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ------------------------ Display informations -------------------------------------------------------------------- */}
          {isInfos && (
            <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 text-black">
              <div className="flex h-[90vh] w-[90vw] flex-col items-center rounded-md bg-white px-4 py-2">
                <div className="flex w-full flex-row justify-between">
                  <Button
                    type="button"
                    onClick={() => setIsInfos(false)}
                    className="rounded-md border-2 border-[var(--pink-g1)] 
                                                    bg-[var(--purple-g2)] px-3 py-2 text-white hover:bg-[var(--pink-g1)]"
                  >
                    Retour
                  </Button>
                  {group?.createdBy === sessionData.user.name ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="rounded-md border-2 border-[var(--pink-g1)] 
                                                        bg-[var(--purple-g2)] px-3 py-2 text-white hover:bg-[var(--pink-g1)]"
                    >
                      Modifier
                    </Button>
                  ) : null}
                </div>
                <div className="mt-2 h-[80vh] w-[80vw]">
                  <div>
                    <h2 className="m-4 w-full border-y-2 border-black text-black">
                      Informations
                    </h2>
                    <div className="divParent">
                      <div className="grid grid-flow-col grid-cols-2">
                        <div className="">
                          <label
                            htmlFor="adminName"
                            className="  mr-2 
                                        border-b-[1px] 
                                        border-[var(--purple-g3)] 
                                        text-left 
                                        text-[14px]
                                        font-bold 
                                        sm:text-base"
                          >
                            Administrateur
                          </label>
                          <div id="memberName">{group?.createdBy}</div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="groupName"
                            className="  mr-2 
                                        border-b-[1px]  
                                        border-[var(--purple-g3)] 
                                        text-left 
                                        text-[14px] 
                                        font-bold
                                        sm:text-base"
                          >
                            Nom du groupe
                          </label>
                          <div id="groupName">{group?.name}</div>
                        </div>
                      </div>
                      <div className="grid grid-flow-col grid-cols-2">
                        <div>
                          <label
                            htmlFor="groupPrivacy"
                            className=" mr-2
                                        border-b-[1px] 
                                        border-[var(--purple-g3)] 
                                        text-left 
                                        text-[14px]
                                        font-bold 
                                        sm:text-base"
                          >
                            Accessibilité
                          </label>
                          {group?.visibility ? (
                            <div className="" id="groupPrivacy">
                              Public
                            </div>
                          ) : (
                            <div className="" id="groupPrivacy">
                              Sur invitation
                            </div>
                          )}
                        </div>
                        <div className="">
                          <label
                            htmlFor="groupMemberCount"
                            className=" mr-2 
                                        border-b-[1px] 
                                        border-[var(--purple-g3)] 
                                        text-left 
                                        text-[14px] 
                                        font-bold 
                                        sm:text-base"
                          >
                            Destination
                          </label>
                          <div id="groupMemberCount">
                            {getCampusAbbrWithFullName(group?.campus ?? "")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="mx-2 mb-3 mt-5 w-full border-y-2 border-black text-black">
                      Membres
                    </h2>
                    {members?.map((member) => (
                      <div key={member.id} className="border-b-2">
                        <div className="flex flex-row">
                          <div className="flex w-[50%] flex-col">
                            <div className="m-2">
                              <div id="memberName">{member.userName}</div>
                            </div>
                          </div>
                          <div className="flex w-[50%] flex-row">
                            <Button
                              onClick={() =>
                                push(`/users/${member.userName}/profile`)
                              }
                              className=" m-2 
                                        h-max 
                                        rounded-md 
                                        border-2 
                                        border-[var(--pink-g1)]    
                                        bg-[var(--purple-g2)] 
                                        px-3 py-2
                                        text-[12px]
                                        text-white 
                                        hover:bg-white 
                                        hover:text-[var(--pink-g1)]
                                        sm:text-xl"
                            >
                              Profil
                            </Button>
                            {member.userName === sessionData.user.name ? (
                              <Button
                                onClick={() => handleDelete(member.id)}
                                className=" m-2 
                                            h-max 
                                            rounded-md 
                                            border-2 
                                            border-[var(--pink-g1)]    
                                            bg-[var(--purple-g2)] 
                                            px-3 py-2
                                            text-[12px] 
                                            text-white
                                            hover:bg-white
                                            hover:text-[var(--pink-g1)]
                                            sm:text-xl"
                              >
                                Quitter
                              </Button>
                            ) : (
                              <>
                                {group?.createdBy === sessionData.user.name ? (
                                  <Button
                                    onClick={() => handleExclude(member.id)}
                                    className=" m-2 
                                                h-max 
                                                rounded-md 
                                                border-2 
                                                border-[var(--pink-g1)]
                                                bg-[var(--purple-g2)]
                                                px-3    
                                                py-2 
                                                text-[12px] text-white
                                                hover:bg-white
                                                hover:text-[var(--pink-g1)]
                                                sm:text-xl"
                                  >
                                    Exclure
                                  </Button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ------------------------ Display form to update group ---------------------------------------------------------- */}
          {isEditing && group && (
            <GroupForm
              cancelButtonHandler={() => setIsEditing(false)}
              group={group}
            />
          )}
        </LayoutMain>
      </>
    );
  else
    return (
      <>
        <LayoutMain>
          <h1>Not Connected, Please Sign in</h1>
          <Button
            className=" m-4 
                        rounded-full 
                        bg-white/10 
                        px-10 
                        py-3 
                        font-semibold 
                        text-white 
                        no-underline 
                        transition 
                        hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Sign in
          </Button>
        </LayoutMain>
      </>
    );
}
