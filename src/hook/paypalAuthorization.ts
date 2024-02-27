/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useState, useEffect } from 'react';
import qs from 'querystring';
import axios from 'axios';

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Get the Paypal authorization token from the Paypal API --------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
export default function getPaypalToken() {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    async function getToken() {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded'
    };

    const clientId = process.env.PAYPAL_CLIENT_ID ?? '';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? '';
    /* the const data will be stringified from 
    " { grant_type: 'client_credentials' } " to " grant_type=client_credentials " */
    const data = qs.stringify({ grant_type: 'client_credentials' });
    const auth = {
      username: clientId,
      password: clientSecret
    };

    try {
      if (clientId === '' || clientSecret === '') throw new Error('Paypal credentials not found');
        const response = await axios.post(url, data, { headers, auth });
        setToken(response.data.access_token);
    } catch (error) {
      console.error(error);
    }
  }

    void getToken();
  }, []);

return token ?? '';
}
