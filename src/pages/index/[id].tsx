import LayoutMain from "$/lib/components/layout/LayoutMain";
import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";


export default function User() {
const { query } = useRouter();
  const id = query.id as string;
  const { data: sessionData } = useSession();

  const { data: userList } = api.user.userList.useQuery(undefined,
    { enabled: sessionData?.user !== undefined }  
    );

    console.log(userList, id);

  if (userList){
    return (
      <>
      <LayoutMain>
        {userList.map((user) => (
          <div key={user.id}>
            <p>{user.email}</p>
            <p>{user.id}</p>
          </div>
        ))}  
      </LayoutMain> 
      </>
    );
  }
  return (
    <>
      <h1>Not Connected</h1>      
    </>
  );
  
};
