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
                <div className='md:text-2xl 
                                text-xl 
                                mx-12 
                                text-center 
                                rounded-[5%] 
                                                            p-4 
                                                            mb-4 
                                                            text-fuchsia-700 
                                                            border-fuchsia-700 
                                                            border-y-2'>                    
                                                                    <p>Ici tu peux ajouter ou retirer des fonds depuis le portefeuille</p>
                                                                </div>
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
                                        <div className="w-screen py-10 px-4">
                                            <div className="flex bg-white h-[700px] max-w-[880px] rounded-[8px] my-0 mx-auto rounded-[8px]">
                                                <aside className="w-[360px] bg-[#f2f2f2] h-[100%] border-tl-[8px] border-bl-[8px] p-[50px]">
                                                    <h2 className="m-0 text-[var(--purple-g3)] text-2xl">Mon Portefeuille</h2>
                                                    <div className="cards"></div>
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
                                                    <div className="transactions"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <style jsx>{`

                                        

                                        .transactions-wrapper {
                                            width: 520px;
                                            padding: 50px;
                                        }
                                        
                                        
                                        .total-balance {
                                            display: inline-block;
                                            float: right;
                                            font-weight: 600;
                                            font-size: 32px;
                                            color: #444750;
                                            
                                        }
                                        .total-balance::before {
                                            content: '$';
                                        }
                                        
                                        .transactions {
                                            margin-top: 60px;
                                            border-top: 1px solid #e5e5e5;
                                            padding-top: 50px;
                                            height: 550px;
                                            overflow: scroll;
                                        }
                                        
                                        .transactions.show {
                                            animation: fade-in .3s 1;
                                        }
                                        
                                        .transactions::-webkit-scrollbar { 
                                            display: none; 
                                        }
                                        
                                        .transaction-item {
                                            margin-bottom: 45px;
                                        }
                                        
                                        .transaction-item {
                                            padding-left: 40px;
                                            position: relative;
                                            display: flex;
                                        }
                                        .transaction-item::before {
                                            position: absolute;
                                            content: '';
                                            border: 2px solid #e1e1e1;
                                            border-radius: 50%;
                                            height: 25px;
                                            width: 25px;
                                            left: 0px;
                                            top: 10px;
                                            box-sizing: border-box;
                                            box-sizing: border-box;
                                            vertical-align: middle;
                                            color: #666666;
                                        }
                                        
                                        .transaction-item.credit::before {
                                            content: '\x02B';
                                            font-size: 25px;
                                            line-height: 19px;
                                            padding: 0px 4px 0px;
                                        }
                                        
                                        .transaction-item.credit .transaction-item_amount .amount,
                                        .transaction-item.credit .transaction-item_amount span{
                                            color: #66cc33;
                                        }
                                        
                                        .transaction-item.debit::before {
                                            content: '\x2212';
                                            font-size: 20px;
                                            line-height: 21px;
                                          padding: 0px 5px;
                                        }	
                                        
                                        .transaction-item.debit .transaction-item_amount .amount,
                                        .transaction-item.debit .transaction-item_amount span{
                                            color: #8393ca;
                                        }
                                        
                                        .transaction-item span.details {
                                            font-size: 14px;
                                            line-height: 14px;
                                            color: #999;
                                        }
                                        
                                        .transaction-item_details {
                                            width: 270px;
                                        }
                                        
                                        .transaction-item_amount {
                                            width: 110px;
                                            text-align: right;
                                        }
                                        .transaction-item_amount span {
                                            font-weight: 600;
                                            font-size: 18px;
                                            line-height: 45px;
                                        }
                                        
                                        .transaction-item_amount .amount {
                                            font-weight: 600;
                                            font-size: 18px;
                                            line-height: 45px;
                                            position: relative;
                                            margin: 0px;
                                            display: inline-block;
                                            text-indent: -15px;
                                        }
                                        
                                        /* Hide + and - */
                                        .transaction-item_amount .amount::first-letter {
                                            color: transparent !important;
                                        }
                                        
                                        .cards {
                                            margin-top: 60px;
                                        }
                                        
                                        
                                        /* animations */
                                        @keyframes fade-in {
                                            0% {
                                                opacity: 0;
                                            }
                                          100% {
                                            opacity: 1;
                                          }
                                        }
                                        
                                        /* media queries */
                                        @media(max-width:810px) {
                                            .wrapper {
                                                border-radius: 8px;
                                            }    
                                            .wallet {
                                                width: 100%;
                                                border-top-right-radius: inherit;
                                                padding-bottom: 25px;
                                            }
                                            .cards {
                                                margin-top: 25px;
                                            }
                                            .app-wrapper {
                                                -webkit-flex-direction: column;
                                            flex-direction: column;
                                                width: 100%;
                                                border-top-right-radius: inherit;
                                                height: initial;
                                            }
                                            .credit-card {
                                                width: calc(50% - 25px);
                                            max-width: 260px;
                                            display: inline-block;
                                            margin-right: 25px;
                                                margin-bottom: 25px;
                                            text-align: left;
                                            }
                                            .credit-card:nth-of-type(2) {
                                                margin-right: 0px;
                                            }
                                            .transactions {
                                                height: initial;
                                            }
                                            .transactions-wrapper {
                                                width: 100%;
                                            }
                                            .transaction-item_amount {
                                                width: calc(100% - 270px);
                                            }
                                        }
                                        
                                        @media(max-width:530px) {
                                            h3 {
                                                line-height: 24px;
                                            }
                                            .total-balance {
                                                    font-size: 22px;
                                            }
                                            .transaction-item_amount {
                                                width: 110px;
                                            }
                                        }
                                        
                                        @media(max-width: 390px) {
                                            .wallet {
                                                padding: 50px 25px;
                                            }
                                            .transactions-wrapper {
                                                padding: 50px 25px;
                                            }
                                            h2 {
                                                font: 18px/24px 'Open Sans', sans-serif;
                                            }
                                        }
                                        `}</style>
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