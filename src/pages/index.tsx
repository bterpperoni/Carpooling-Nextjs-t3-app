/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import LayoutMain from '../lib/components/layout/LayoutMain';
import { signIn, useSession } from "next-auth/react";
import Button from "$/lib/components/button/Button";

export default function Home() {

  // Session recovery
    const { data: session } = useSession();

  return (
    <>
      <LayoutMain>
          <section className="flex flex-col min-h-screen items-center justify-center">
            <h1 className="text-6xl text-white">CARHEH</h1>
                <h2 className="text-2xl text-white">Carpooling for students</h2>
                  <div className="flex flex-col items-center">  
                    {/* No session */}
                      {!session && <Button className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => void signIn()}>Sign in</Button>}
                    {/* Session */}
                      {session && (
                        <>
                        <div className='border-2 border-white m-4 flex flex-col items-center tet-center p-2'>
                          <h1>Logged in as {session.user.name}</h1>
                          <h2>Session expires in {session.expires}</h2>
                        </div>
                        </>
                      )}
                  </div>
            </section> 
        </LayoutMain>    
    </>
  );
}

