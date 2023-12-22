

export default function MainHtml({ children }: { children: React.ReactNode }) {

    return (
        <>
        <main className=" flex flex-col ">
                {children}
        </main>
        </>
    );
}