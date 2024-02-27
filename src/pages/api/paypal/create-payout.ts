/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res:  NextApiResponse) {

  
    if (req.method === 'POST') {
      try {
        const accessToken = process.env.PAYPAL_ACCESS_TOKEN ?? '';
        console.log(accessToken);
        const requestBody = {
          sender_batch_header: {
            sender_batch_id: 'batch_' + Math.random().toString(3).substring(9),
            email_subject: 'Payment from Business Account',
            email_message: "Withdrawing funds from your account"
          },
          items: [
            {
              recipient_type: 'EMAIL',
              amount: {
                value: '100.00',
                currency: 'EUR'
              },
              note: 'Withdrawal',
              sender_item_id: 'item_' + Math.random().toString(3).substring(9),
              receiver: 'sb-pvw8l29057890@personal.example.com'
            }
          ]
        };
  
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          body: JSON.stringify(requestBody)
        });
        
        const responseData = await response.json();
  
        if (response.ok) {
          res.status(200).json({ success: true, data: responseData });
        } else {
          res.status(response.status).json({ success: false, error: responseData.error});
        }
      } catch (error) {
        res.status(500).json({ success: false, error: res.errored });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
  }
  