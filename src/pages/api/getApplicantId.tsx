import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    // get signature
    const ts = Math.floor(Date.now() / 1000);
    const method = 'GET';
    const path = `/resources/applicants/-;externalUserId=${userId}/one`;
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';

    const stringToSign = ts + method + path;
    const signature = crypto.createHmac('sha256', secretKey);
    signature.update(stringToSign);

    const response = await fetch(`https://api.sumsub.com${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-App-Token': process.env.SUMSUB_APP_TOKEN || '',
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
        },
    });

    const data = await response.json();
    res.status(200).json(data); 
}
