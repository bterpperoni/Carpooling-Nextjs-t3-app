import LayoutMain from "$/lib/components/layout/LayoutMain";
import NewTripForGroupForm from "$/lib/components/form/RideForm";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "$/lib/components/button/Button";
import LoaderSpinner from "$/lib/components/error/LoaderSpinner";



/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to create a new ride for a group -----------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function NewRideForGroup() {

    const { data: sessionData } = useSession();
    const { query } = useRouter();
    const groupId = query.group;

    if(!groupId){
        return (
            <LayoutMain>
                <LoaderSpinner></LoaderSpinner>
            </LayoutMain>
        )
    }

    if (sessionData) {
        return (
            <>
                <LayoutMain>
                    <div className="flex flex-col items-center">
                        <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
                        Planifier un trajet pour le groupe {groupId}
                        </h2>
                        <NewTripForGroupForm isForGroup groupId={parseInt(groupId as string)} />
                    </div>
                </LayoutMain>
            </>
        );
    }
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
                        onClick={() => void signIn()}>Sign in</Button>
            </LayoutMain>
        </>
    );
}