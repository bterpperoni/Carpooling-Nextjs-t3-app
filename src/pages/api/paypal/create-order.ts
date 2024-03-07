/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import client from '$/utils/paypal';
import paypal from '@paypal/checkout-server-sdk';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { RequestBody } from '$/lib/types/interfaces';



export default async function Handler(req: NextApiRequest, res:  NextApiResponse) {

    if(req.method != "POST")
    return res.status(404).json({success: false, message: "Not Found"})

    const requestBody: RequestBody = req.body;
    if (!requestBody.order_price ?? !requestBody.user_id) {
    return res.status(400).json({ success: false, message: "Please Provide order_price And User ID" });
  }

    try {
        const paypalClient = client();
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers.Prefer = 'return=representation';
        request.headers['Content-Type'] = 'application/json';
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: requestBody.order_price,
              },
            },
          ],
        });
        
        const response = await paypalClient.execute(request);
        if (response.statusCode !== 201) {
          console.log("RES: ", response);
          return res.status(500).json({ success: false, message: "Some Error Occured at backend" });
        }
    
        /* TODO : Save the order in the database */
        // console.log("Order: ", response.result);
        
        res.status(200).json({ success: true, data: { order: response.result } });
        
      } catch (err) {
        console.log("Err at Create Order: ", err);
        return res.status(500).json({ success: false, message: "Could Not Found the user" });
      }
}
