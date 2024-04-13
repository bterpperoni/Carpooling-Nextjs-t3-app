import LayoutMain from '../../lib/components/layout/LayoutMain';
import { signIn, useSession } from 'next-auth/react';
import NewRideForm from '../../lib/components/form/RideForm';
import Button from '$/lib/components/button/Button';


/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Page to create ride -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function NewRide()  {
    /* ------------ States ------------------ */
    const { data: sessionData } = useSession();

    /* ------------ Render ------------------ */
    if(sessionData) {
    return (
         <>
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
                                Planifier un trajet
                    </h2>
                    <NewRideForm />
                </div>
            </LayoutMain>
        </>
       );
    }
    return (
        <>     
            <LayoutMain>
                <h1>Not Connected, Please Sign in</h1>
                <Button className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => void signIn()}>Sign in</Button>
            </LayoutMain> 
        </>
    );
}
