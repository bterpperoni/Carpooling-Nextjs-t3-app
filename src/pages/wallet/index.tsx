import LayoutMain from "$/lib/components/layout/LayoutMain"
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useSession } from "next-auth/react";


export default function Paypal() {

    const { data: session } = useSession();

    if (!session) {
        return (
            <LayoutMain>
                <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-black">Please Sign In to Proceed</h1>
                </div>
            </LayoutMain>
        )
    }
    return (
        <LayoutMain>
            <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-black">Paypal</h1>
                <PayPalScriptProvider options={{ "clientId": "sb" }}>
                    <PayPalButtons style={{ layout: "horizontal" }} />
                </PayPalScriptProvider>
            </div>
        </LayoutMain>
    )
}