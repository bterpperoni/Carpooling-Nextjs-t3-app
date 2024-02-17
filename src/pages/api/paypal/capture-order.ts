/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import client from '$/utils/paypal'
import paypal from '@paypal/checkout-server-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function Handler(req : NextApiRequest, res: NextApiResponse) {

  if(req.method != "POST")
    return res.status(404).json({success: false, message: "Not Found"})

  if(!req.body.orderID){
    return res.status(400).json({success: false, message: "Please Provide Order ID"})
  }

    //Capture order to complete payment
    const { orderID } = req.body
    const paypalClient = client()
    const request = new paypal.orders.OrdersCaptureRequest(orderID)
    // request.requestBody({}) mandatory because orderID is already passed in the constructor
    const response = await paypalClient.execute(request)
    if (!response) {
      return res.status(500).json({success: false, message: "Some Error Occured at backend"})
    }

    // Custom Code to Update Order Status in Database
    // And Other stuff that is related to that order, like wallet
    
    // Ex. Below: Get the order status and other details from the response
    const order = response.result.purchase_units[0].payments.captures[0]

    res.status(200).json({
      success: true, 
      data: {
        order: {
          id: order.id, 
          status: order.status, 
          create_time: order.create_time 
        }
      }
    })
}