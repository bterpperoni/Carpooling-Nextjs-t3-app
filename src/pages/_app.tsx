import "$/styles/globals.css";

import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {type AppType} from "next/app";
import {api} from "$/utils/api";
import {ApiKeyProvider} from "$/context/apiContext";
import { StrictMode } from "react";


const Carheh: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: {session, ...pageProps},
}) => {
    return (
        <StrictMode>
            <ApiKeyProvider>
            <SessionProvider session={session}>
                    <Component {...pageProps} />
            </SessionProvider>
        </ApiKeyProvider>
        </StrictMode>
    );
};

// default _app export with trpc context
export default api.withTRPC(Carheh);
