import "$/lib/styles/globals.css";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";


import { api } from "$/utils/api";
import { env } from "process";
import GOOGLEProvider from 'next-auth/providers/GOOGLE';


const Carheh: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

// default _app export with trpc context
export default api.withTRPC(Carheh);
