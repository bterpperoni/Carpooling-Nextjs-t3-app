import NavBar from "$/lib/components/nav/Nav";

export default function LayoutMain({ children }: { children: React.ReactNode }) {

    

    return (
        <>
            <header className="mb-20">
                <title>Carheh</title>
                <meta name="description" content="Carheh Carpooling for students from Mons" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
                <NavBar />
            </header>
            <main className="flex flex-col bg-[var(--purple-g3)]">
                {children}
            </main>
            {/* After : add footer /!\ */}
        </>
    );
}