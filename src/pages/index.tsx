/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import LayoutMain from '../lib/components/layout/LayoutMain';
import { signIn, useSession } from "next-auth/react";
import Button from "$/lib/components/button/Button";
import dayjs from 'dayjs';
export default function Home() {

  // Session recovery
  const { data: session } = useSession();

  return (
    <>
      <LayoutMain>
        <section className="flex flex-col min-h-screen items-center justify-center">
          <h1 className="text-6xl text-white">CarHeH</h1>
          <img
            src="/images/logo.png"
            alt="CarHeH logo"
            width={200}
            height={200}
            style={{ borderRadius: '35%', width: '200px', height: '200px' }}
            className='mb-2'
          />
          <h2 className="text-2xl text-white border-2 border-white p-2 rounded-lg">Covoiturage pour les étudiants</h2>
          <div className="flex flex-col items-center">
            {/* No session */}
            {!session && <Button className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => void signIn()}>Sign in</Button>}
            {/* Session */}
            {session && (
              <>
                <div className=' m-4 flex flex-col items-center tet-center p-2'>
                  <h1>Bienvenue {session.user.name}</h1>
                  <h2>Votre session expire le {dayjs(session?.expires).format('DD/MM/YYYY')}</h2>
                </div>
              </>
            )}
          </div>
        </section>
      </LayoutMain>
    </>
  );
}

