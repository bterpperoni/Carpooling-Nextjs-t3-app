/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

  let clientId
  let clientSecret 

  const configureEnvironment = function () {
    clientId = process.env.PAYPAL_CLIENT_ID ?? ''
    clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? ''
  return process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
}

const client = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment())
}

export default client