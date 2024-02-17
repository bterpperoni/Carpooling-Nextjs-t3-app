import LayoutMain from "$/lib/components/layout/LayoutMain";
import NewTripForGroupForm from "$/lib/components/form/RideForm";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "$/lib/components/button/Button";



/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to create a new ride for a group -----------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function NewRideForGroup() {

    const { data: sessionData } = useSession();
    const { query } = useRouter();
    const groupId = query.id;

    if (sessionData) {
        return (
            <>
                <LayoutMain>
                    <div className="bg-[var(--purple-g3)] max-w-[90%] h-screen">
                        <h1 className="text-6xl text-white mt-6">Nouveau Trajet</h1>
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