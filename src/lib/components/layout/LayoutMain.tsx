import Head from "next/head";
import NavBar from "$/lib/components/nav/Nav";


export default function LayoutMain({ children }: { children: React.ReactNode }) {



    return (
        <>
            <Head>
                <title>CARHEH</title>
                <meta name="description" content="CARHEH Carpooling for students from Mons" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <main className="flex flex-col">
                {children}
            </main>
            {/* After : add footer /!\ */}
        </>
    );
}