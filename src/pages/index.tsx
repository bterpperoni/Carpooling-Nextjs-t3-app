import Head from "next/head";
import { api } from "$/utils/api";
import NavBar from "$/lib/components/nav/Nav";
import AuthShowcase from "$/lib/components/auth/AuthShowCase";

export default function Home() {
  const hello = api.user.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>CARHEH</title>
        <meta name="description" content="CARHEH Carpooling for students from Mons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar></NavBar>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-6xl text-white">CARHEH</h1>
        <h2 className="text-2xl text-white">Carpooling for students from Mons</h2>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

