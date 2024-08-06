import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, levelName = 'basic-kyc-level' } = req.body;

    // get signature
    const ts = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';
    const body = JSON.stringify({
        externalUserId: email,
        email: email,
    })

    const signature = crypto.createHmac('sha256', secretKey);
    signature.update(ts + method + path)
    signature.update(body);

    const response = await fetch(`https://api.sumsub.com${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-App-Token': process.env.SUMSUB_APP_TOKEN || '',
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
        },
        body: body,
    });

    const data = await response.json();
    res.status(200).json(data);    
}
