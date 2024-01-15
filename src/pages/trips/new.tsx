import LayoutMain from '../../lib/components/layout/LayoutMain';
import { useSession } from 'next-auth/react';
import NewTripForm from '../../lib/components/form/TripForm';

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
            </LayoutMain> 
        </>
    );
}
