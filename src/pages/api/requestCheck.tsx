import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    // get applicantId 
    const appIdResponse = await fetch(`${req.headers.origin}/api/getApplicantId?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const appIdData = await appIdResponse.json();
    const applicantId = appIdData.id; 

    // get signature
    const ts = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = `/resources/applicants/${applicantId}/status/pending`;
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';

    const signature = crypto.createHmac('sha256', secretKey);
    signature.update(ts + method + path)

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
    console.log(data)
    res.status(200).json(data);    
}
