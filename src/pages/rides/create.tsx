import Loader from '$/lib/components/error/Loader';
import { useSession } from 'next-auth/react';
import NewRideForm from '$/lib/components/form/RideForm';
import LayoutMain from '$/lib/components/layout/LayoutMain';


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
                    <h2 className="mb-4 mt-4 w-full w-max rounded-lg bg-fuchsia-700 p-4 text-center text-2xl font-bold text-white shadow-lg md:text-4xl">
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
                <Loader />
            </LayoutMain> 
        </>
    );
}
