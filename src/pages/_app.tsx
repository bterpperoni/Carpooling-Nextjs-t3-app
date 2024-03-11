import "$/styles/globals.css";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "$/utils/api";
import { ApiKeyProvider } from "$/context/google";

const Carheh: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ApiKeyProvider>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    </ApiKeyProvider>
  );
};

// default _app export with trpc context
export default api.withTRPC(Carheh);
