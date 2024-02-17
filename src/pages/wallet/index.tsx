/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import LayoutMain from "$/lib/components/layout/LayoutMain"
import type { Order } from "@paypal/checkout-server-sdk/lib/orders/lib";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import axios from "axios";
import { useSession } from "next-auth/react";

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
                // Your custom code to show an error like showing a toast:
                // toast.error('Some Error Occured')
                return null;
            }
    }

    const paypalCaptureOrder = async (orderId: string) => {
        try {
          const response = await axios.post('/api/paypal/capture-order', {
            orderID: orderId
          })
          if (response.data.success) {
            // Order is successful
            // And/Or Adding Balance to Redux Wallet
            // dispatch(setWalletBalance({ balance: response.data.data.wallet.balance }))
            console.log("Success : " + response.data.data.order);
          }
        }catch(err) {
          // Order is not successful
          console.log('Error : ' + err);
        }
      }

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
                            layout: "horizontal"
                        }}
                        createOrder={async (data, actions) => {
                            const order_id = await paypalCreateOrder();
                            console.log("OrderId :" + order_id)
                            return order_id + ''
                        }}
                        onApprove={async (data, actions) => {
                            console.log('Capture order with ID :', data.orderID);
                            const response = await paypalCaptureOrder(data.orderID);
                            console.log('Response : ' + response);
                        }}
                    />
                    </PayPalScriptProvider>
                </div>
            </div>
        </LayoutMain>
    )
}

// Paypal buttons example
{/*                 <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '' }}>
                        <PayPalButtons style={{ layout: "horizontal" }} createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: "1",
                                        },
                                        description: "Donation"
                                    },
                                ],
                            });
                        }} />
                    </PayPalScriptProvider> */}