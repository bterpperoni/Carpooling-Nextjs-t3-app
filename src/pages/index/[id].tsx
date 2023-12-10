import { api } from "$/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";



export default function User() {

  const { data: sessionData } = useSession();

  const { data: userList } = api.user.userList.useQuery(undefined,
    { enabled: sessionData?.user !== undefined }  
    );

  console.log(userList);

  if (userList){
    return (
      <>
        {userList.map((user) => (
          <div key={user.id}>
            <p>{user.email}</p>
          </div>
        ))}   
      </>
    );
  }
  return (
    <>
      <h1>Not Connected</h1>
      
    </>
  );
  
};
