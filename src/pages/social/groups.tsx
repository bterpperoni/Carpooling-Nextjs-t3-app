import LayoutMain from "$/lib/components/layout/LayoutMain";
import { useSession } from "next-auth/react";


export default function Groups() {

    const { data: sessionData } = useSession();

    if (sessionData) {
        return (
            <LayoutMain>
                <h1>Groups</h1>
            </LayoutMain>
        );
    }
    return (   
        <LayoutMain>
            <h1>Groups</h1>
            <p>You must be signed in to view this page</p>
        </LayoutMain>
    );
}