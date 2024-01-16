import LayoutMain from '../../lib/components/layout/LayoutMain';
import { signIn, useSession } from 'next-auth/react';
import NewTripForm from '../../lib/components/form/RideForm';
import Button from '$/lib/components/button/Button';

/* --------------------------------------------------------- */

export default function NewTrip()  {
    /* ------------ States ------------------ */
    const { data: sessionData } = useSession();

    /* ------------ Render ------------------ */
    if(sessionData) {
    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]  h-screen">
                    <h1 className="text-6xl text-white mt-6">New Trip</h1>
                    <NewTripForm />
                </div>
            </LayoutMain>
        </>
       );
    }
    return (
        <>     
            <LayoutMain>
                <h1>Not Connected, Please Sign in</h1>
                {!sessionData && <Button className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => void signIn()}>Sign in</Button>} 
            </LayoutMain> 
        </>
    );
}
