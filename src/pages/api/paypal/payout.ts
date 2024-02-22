/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// pages/api/payout.js


import type { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
;



export default async function handler(req: NextApiRequest, res:  NextApiResponse) {

    if (req.method === 'POST') {
      try {
        const requestBody = {
          sender_batch_header: {
            sender_batch_id: 'batch_' + Math.random().toString(3).substring(9),
            email_subject: 'Payment from Business Account'
          },
          items: [
            {
              recipient_type: 'sb-pvw8l29057890@personal.example.com',
              amount: {
                value: '100.00',
                currency: 'EUR'
              },
              note: 'Whitewash Payment',
              receiver: 'sb-pvw8l29057890@personal.example.com'
            }
          ]
        };
  
        const response = await fetch('https://api-m.paypal.com/v1/payments/payouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`
          },
          body: JSON.stringify(requestBody)
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          res.status(200).json({ success: true, data: responseData });
        } else {
          res.status(response.status).json({ success: false, error: responseData.error });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: error});
      }
    } else {
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
  }
  