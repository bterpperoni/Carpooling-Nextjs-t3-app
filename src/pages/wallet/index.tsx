/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import getPaypalToken from "$/hook/paypalAuthorization";
import { useEffect } from "react";
import { api } from "$/utils/api";
import paypal from '@paypal/checkout-server-sdk';

export default function Paypal() {

const { data: session } = useSession();
// Check if the user has a wallet & create one if not
const { data: existingWallet } = api.wallet.walletByUserId.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: session?.user?.id !== undefined }
);
// Create wallet if not exists
const { data: createdWallet, mutate: createWallet } = api.wallet.create.useMutation();

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

const accessToken = getPaypalToken();
const paypalCreatePayout = async () => {
    try {
        if(accessToken === '') throw new Error('Access Token not found');
        else {
            const response = await axios.post('/api/paypal/create-payout', {
                accessToken: accessToken
            });
            return response.data;
        }
    } catch (err) {
        alert('Error : ' + err);
        return null;
    }
}

useEffect(() => {

    if(existingWallet === null) {
        console.log("Creating Wallet..");
        createWallet({ balance: 0 });
    }else{
        console.log("Wallet: " + JSON.stringify(existingWallet));
    }

    if(accessToken !== '') console.log("Access Token: " + accessToken);
}, [accessToken]);

if (session) {
return (
                                <LayoutMain>
                                    <div className="bg-[var(--purple-g3)]">
                                                    <div className='flex flex-col items-center mt-2'>  
                                                        <div className='border-b-t-2 border-0 border-white'>   
                                                            <div className='md:text-2xl text-xl mx-12 bg-[var(--purple-g3)] text-center 
                                                                            rounded-[5%] p-4 mb-4 text-fuchsia-700 border-fuchsia-700 border-y-2'>                    
                                                                <p>Gérer le portefeuille</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                    </div>
                                    <div className="mx-auto mt-8 bg-white p-8 rounded shadow-md w-full flex flex-col items-center">
                                        
                                    </div>
                                    <div className="w-screen py-10 px-4">
                                        <div className="flex bg-white h-[700px] max-w-[880px] rounded-[8px] my-0 mx-auto rounded-[8px]">
                                            <aside className="w-[360px] bg-[#f2f2f2] h-[100%] border-tl-[8px] border-bl-[8px] p-[50px]">
                                                <h2 className="m-0 text-[var(--purple-g3)] text-2xl">Dépôt et Débit</h2>
                                                
                                                <div className="flex flex-col items-center ">
                                                    <div className=" w-[100%] h-[15vh] ">
                                                        <div className="text-black text-center my-4 text-[18px] border-y-2 w-full border-black p-2">
                                                            Ajouter des fonds avec votre compte paypal
                                                        </div>
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
                                                    <div className=" w-[100%] h-[15vh] my-24">
                                                        <div className="text-black text-center my-4 text-[18px] border-y-2 w-full border-black p-2">
                                                            Retirer des fonds vers votre comtpe paypal
                                                        </div>
                                                        <Button onClick={
                                                            async () => {
                                                                console.log('Payout..');
                                                                const paypalPayout = await paypalCreatePayout();
                                                                console.log("Payout: " + JSON.stringify(paypalPayout));
                                                            }}
                                                            className="mt-4 border-2 p-2 rounded-[10%] 
                                                                        text-black hover:bg-[var(--pink-g1)] 
                                                                        hover:text-white">
                                                            Retirer des fonds
                                                        </Button>
                                                    </div>
                                                </div>
                                            </aside>
                                            <div className="w-[520px] p-[50px]">
                                                <h2 className="m-0 text-[var(--purple-g3)] text-2xl">
                                                Mon Solde
                                                    <span className="inline-block 
                                                                    float-right 
                                                                    font-weight-600 
                                                                    font-size-32px 
                                                                    color-444750">
                                                        {existingWallet?.balance + '$' ?? 'Erreur de chargement'}
                                                    </span>
                                                </h2>
                                                <div className="transactions">
                                                    <div>
                                                        ok
                                                    </div>
                                                </div>
                                            </div>
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