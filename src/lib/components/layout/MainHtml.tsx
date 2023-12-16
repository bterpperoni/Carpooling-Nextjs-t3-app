

export default function MainHtml({ children }: { children: React.ReactNode }) {

    return (
        <>
        <main className=" flex flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {children}
        </main>
        </>
    );
}