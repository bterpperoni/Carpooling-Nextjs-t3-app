import Head from "next/head";
import NavBar from "$/lib/components/nav/Nav";


export default function LayoutMain({ children }: { children: React.ReactNode }) {



    return (
        <>
            <Head>
                <title>CARHEH</title>
                <meta name="description" content="CARHEH Carpooling for students from Mons" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar></NavBar>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {children}
            </main>
        </>
    );
}