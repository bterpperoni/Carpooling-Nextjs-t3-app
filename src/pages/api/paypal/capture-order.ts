/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import client from '$/utils/paypal'
import paypal from '@paypal/checkout-server-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function Handler(req : NextApiRequest, res: NextApiResponse) {

  if(req.method != "POST")
    return res.status(404).json({success: false, message: "Not Found"})

  if(!req.body.orderID)
    return res.status(400).json({success: false, message: "Please Provide Order ID"})

  //Capture order to complete payment
    const { orderID } = req.body
    const PaypalClient = client()
    const request = new paypal.orders.OrdersCaptureRequest(orderID)
    request.requestBody({ payment_source: { token: req.body.payerID } })
    const response = await PaypalClient.execute(request)
    if (!response) {
        return res.status(500).json({success: false, message: "Some Error Occured at backend"})
    }

    // Custom Code to Update Order Status
    // And Other stuff that is related to that order, like wallet
    
    // Ex. Below: Updating the wallet and sending it back to frontend to update it on frontend
    const wallet = 'Updated Wallet Amount (test)'

    res.status(200).json({success: true, data: {wallet}})
}