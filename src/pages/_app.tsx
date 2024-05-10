import "$/styles/globals.css";

import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {type AppType} from "next/app";
import {api} from "$/utils/api";
import {ApiKeyProvider} from "$/context/apiContext";
import { StrictMode } from "react";
import { MapProvider } from '$/context/mapContext';
import { PusherProvider } from "$/context/pusherContext";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: "eu",
    forceTLS: true
  });

  

const Carheh: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: {session, ...pageProps},
}) => {
    return (
        <StrictMode>
            <SessionProvider session={session}>
                <PusherProvider pusher={ pusher }>
                    <ApiKeyProvider>
                        <MapProvider>
                            <Component {...pageProps} />
                        </MapProvider>
                    </ApiKeyProvider>
                </PusherProvider>
            </SessionProvider>
        </StrictMode>
    );
};

// default _app export with trpc context
export default api.withTRPC(Carheh);
