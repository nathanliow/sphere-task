import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body;

    const ts = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = `resources/applicants`;
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';

    const stringToSign = ts + method + path;
    const signature = crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');

    const response = await fetch(`https://api.sumsub.com${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-App-Token': process.env.SUMSUB_APP_TOKEN || '',
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature,
        },
        body: JSON.stringify({
            externalUserId: email,
            email: email,
        }),
    });

    const data = await response.json();
    res.status(200).json(data);
}
