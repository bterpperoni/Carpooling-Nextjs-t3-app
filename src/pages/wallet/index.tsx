/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-base-to-string */
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
import { useEffect, useState } from "react";
import type {ChangeEvent} from "react";
import { api } from "$/utils/api";

export default function Wallet() {
// Get session
const { data: session } = useSession();
// Check if the user has a wallet & create one if not
const { data: existingWallet } = api.wallet.walletByUserId.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: session?.user?.id !== undefined }
);
// Amount const fort withdraw & deposit
const [ depositAmount, setDepositAmount ] = useState<string>('50');
const [ withdrawAmount, setWithdrawAmount ] = useState<string>(existingWallet?.balance ?? '0');


// Create wallet if not exists
const { mutate: createWallet } = api.wallet.create.useMutation();
// Create Paypal Order
const { mutate: createPaypalOrder } = api.paypal.create.useMutation();
// Update Wallet
const { mutate: updateWallet } = api.wallet.update.useMutation();

// ------------------------- Paypal Orders --------------------------------------
const paypalCreateOrder = async (orderPrice: string): Promise<string | null> => {
        try {
            const response = await axios.post('/api/paypal/create-order', {
                user_id: session?.user?.id,
                order_price: orderPrice
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
            if(existingWallet?.id !== undefined) {
                const paypalDeposit = {
                    orderId: statusOrder.id,
                    walletId: existingWallet.id,
                    amount: statusOrder.amount,
                    type: 'deposit'
                }
                // Create a deposit transaction
                createPaypalOrder(paypalDeposit);
                // Update the wallet balance
                const newBalance: number = parseInt(existingWallet.balance ?? '0') + parseFloat(statusOrder.amount);
                updateWallet({
                    id: existingWallet.id,
                    userId: existingWallet.userId,
                    balance: newBalance.toString()
                });
                console.log("..Success : " + JSON.stringify(paypalDeposit));

            }
        }
        return response.data;
    } catch (err) {
        // Order is not successful
        console.log('Error : ' + err);
        return undefined;
    }
}

// ------------------------- Paypal Payouts --------------------------------------
const accessToken = getPaypalToken();
const paypalCreatePayout = async (wthdrwl: string) => {
    try {
        if(accessToken === '') throw new Error('Access Token not found');
        else {
            const response = await axios.post('/api/paypal/create-payout', {
                accessToken: accessToken,
                amount: wthdrwl,
                email: 'sb-l0khw28500478@personal.example.com'
            });
            return response.data;
        }
    } catch (err) {
        alert('Error : ' + err);
        return null;
    }
}

// ---------------------------- useEffect -----------------------------------------------
useEffect(() => {
    if(existingWallet === null) {
        console.log("Creating Wallet..");
        createWallet({ balance: '0' });
    }else{
        // TODO: Delete this console.log when feature is complete
        // console.log("Wallet: " + JSON.stringify(existingWallet));
        console.log("Wallet Exists..");
    }

}, [existingWallet, createWallet]);

// ------------------------------ Render the wallet page ------------------------------
if (session) {
return (
    <LayoutMain>
        <div className="w-screen overflow-hidden bg-[var(--purple-g3)]">
            <div className='flex flex-col items-center mt-2'>  
                <div className='border-b-t-2 border-0 border-white'>   
                    <div className='md:text-2xl text-xl mx-12 bg-[var(--purple-g3)] text-center 
                                    rounded-[5%] p-4 mb-4 text-fuchsia-700 border-fuchsia-700 border-y-2'>                    
                        <p>Gérer le portefeuille</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-screen py-8 px-6">
            <div className="flex md:flex-row flex-col bg-white h-max max-w-[880px] rounded-[8px] my-0 mx-auto rounded-[8px]">
                <aside className="w-[360px] bg-[#f2f2f2] h-[100%] border-tl-[8px] border-bl-[8px] p-[20px]">
                    <h2 className="m-0 text-[var(--purple-g3)] text-2xl mt-4">Dépôt</h2>    
                    <div className="block items-center">
                        <div className=" w-[100%] inline-block">
                            <div className="text-black text-center my-2 text-[18px] border-y-2 w-full border-black p-2">
                                Depuis Paypal
                            </div>
                            <div className="  mt-5 flex flex-col mb-4 w-[100%]"> 
                                <p className="text-center text-gray-500">Montant à Ajouter : 
                                { depositAmount!=='' ? <b> {depositAmount} €</b> : <b> 50 €</b> }
                                </p>
                                <input type="range" 
                                       min={10} max={100} 
                                       value={depositAmount} 
                                       className="ds-range ds-range-warning"
                                       onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                                        setDepositAmount(e.target.value);
                                    }} />
                            </div>
                            <PayPalScriptProvider
                                options={{
                                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
                                currency: 'EUR'
                                }}>
                                <PayPalButtons
                                    style={{
                                        color: 'gold',
                                        label: 'pay',
                                        shape: "rect",
                                        layout: "horizontal",
                                        height: 40,
                                        tagline: false
                                    }}
                                    forceReRender={[depositAmount]}
                                    createOrder={async () => {
                                        const order_id = await paypalCreateOrder(depositAmount);
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
                        {/* Transition */}
                        <div className="border-y-2 border-gray-400 w-full h-2 mt-10 mb-5"></div>
                        {/* /Transition */}
                        <div className=" w-[100%]  items-center flex flex-col">
                            <h2 className="mt-4 text-[var(--purple-g3)] text-2xl">Retrait</h2>
                            <div className="text-black text-center my-2 text-[18px] border-y-2 w-full border-black p-2">
                                Vers Paypal
                            </div>
                            <div className=" mt-5 flex flex-col mb-4 w-[100%]">
                                <p className="text-center text-gray-500">Montant à Retirer : 
                                { withdrawAmount!=='' ? <b> {withdrawAmount} €</b> : <b> {existingWallet?.balance}</b> }
                                </p>
                                <input type="range" 
                                       min={0} max={existingWallet?.balance ?? 0} 
                                       value={withdrawAmount} 
                                       className="ds-range ds-range-info"
                                       onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                                        setWithdrawAmount(e.target.value);
                                    }} />
                            </div>
                            <Button onClick={
                                async () => {
                                    console.log('Payout..');
                                    const paypalPayout = await paypalCreatePayout(withdrawAmount);
                                    console.log("Payout: " + JSON.stringify(paypalPayout));
                                }}
                                className="border-2 p-2 rounded-[15px]
                                            bg-blue-500 
                                            text-white hover:bg-white 
                                            hover:text-blue-500 hover:border-blue-500">
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
                            {existingWallet!==undefined ? existingWallet?.balance + '€' : 'Erreur de chargement'}
                        </span>
                    </h2>
                    <div className="transactions">
                        <div>
                            
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
)}