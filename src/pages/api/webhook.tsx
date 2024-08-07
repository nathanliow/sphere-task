import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['x-payload-digest'];
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';
    const calculatedDigest = crypto
        .createHmac('HMAC_SHA256_HEX', secretKey)
        .update(req.body)
        .digest('hex')

    if (calculatedDigest !== sig) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(buf.toString());

    // Handle the webhook event
    console.log('Received webhook:', event);

    // Respond to Sumsub to acknowledge receipt
    res.status(200).send('Webhook received');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
