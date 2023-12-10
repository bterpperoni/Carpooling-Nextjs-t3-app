import { api } from "$/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthShowcase() {
    // `useSession` is a React hook that will return the session object
    const { data: sessionData } = useSession();
  
    // `useQuery` is a React hook that will run the query whenever the inputs change (in this case, the session)
    const { data: secretMessage } = api.user.getSecretMessage.useQuery(undefined, 
      { enabled: sessionData?.user !== undefined }
    );
  
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    );
  }

    export default AuthShowcase;