/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import Button from "$/lib/components/button/Button";
import LayoutMain from "$/lib/components/layout/LayoutMain"
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

export default function Paypal() {

    const { data: session } = useSession();

    const paypalCreateOrder = async () => {
            try {
                const response = await axios.post('/api/paypal/create-order', {
                    user_id: session?.user?.id,
                    order_price: 10
                })
                return response.data.data.order.id;
            } catch (err) {
                alert('Error : ' + err);
                return null;
            }
    }

    const paypalCaptureOrder = async (orderId: string): Promise<JSON | undefined> => {
        try {
            const response = await axios.post('/api/paypal/capture-order', {
                orderID: orderId
            });
            if (response.data.success) {
                // Order is successful
                const statusOrder = response.data.data.order;
                console.log("..Success : " + JSON.stringify(statusOrder));
            }
            return response.data;
        } catch (err) {
            // Order is not successful
            console.log('Error : ' + err);
            return undefined;
        }
    }

    if (session) {
    return (
        <LayoutMain>
            <div className="mx-auto mt-8 bg-white p-8 rounded shadow-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-black">Paypal</h1>
                <div className="flex flex-col items-center ">
                    <PayPalScriptProvider
                        options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
                        currency: 'EUR'
                        }}
                    >
                    <PayPalButtons
                        style={{
                            color: 'gold',
                            label: 'pay',
                            shape: "rect",
                            layout: "horizontal",
                            height: 40,
                            tagline: false
                        }}
                        createOrder={async () => {
                            const order_id = await paypalCreateOrder();
                            console.log("Creating Order: " + order_id)
                            return order_id + ''
                        }}
                        onApprove={async (data) => {
                            console.log('Capturing Order..');
                            await paypalCaptureOrder(data.orderID);
                            console.log("Order Confirmed: " + JSON.stringify(data));
                        }}
                    />
                    </PayPalScriptProvider>
                </div>
            </div>
        </LayoutMain>
    )}
    return (
        <LayoutMain>
                    <h1>Not Connected, Please Sign in</h1>
                    <Button 
                        className=" m-4 
                                    rounded-full 
                                    bg-white/10 
                                    px-10 
                                    py-3 
                                    font-semibold 
                                    text-white 
                                    no-underline 
                                    transition 
                                    hover:bg-white/20" 
                        onClick={() => void signIn()}>Sign in</Button>
        </LayoutMain>
    )
}