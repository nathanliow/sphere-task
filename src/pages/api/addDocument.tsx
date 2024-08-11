import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import FormData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, documentImage, documentType, documentSide, country } = req.body;

    // get applicantId 
    const appIdResponse = await fetch(`${req.headers.origin}/api/getApplicantId?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const appIdData = await appIdResponse.json();
    const applicantId = appIdData.id;    

    // Create FormData
    let form = new FormData();
    form.append('metadata', JSON.stringify({ idDocType: documentType, idDocSubType: documentSide, country: country }));
    
    // Extract the base64 data
    const ext = documentImage.substring("data:image/".length, documentImage.indexOf(";base64"));
    const base64Data = documentImage.split(',')[1];
    const filename = `${documentType}.${ext}`;
    form.append('content', Buffer.from(base64Data, 'base64'), { filename });

    // get signature
    const ts = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const path = `/resources/applicants/${applicantId}/info/idDoc`;
    const secretKey = process.env.SUMSUB_SECRET_KEY || '';
    const body = form.getBuffer();
    
    const stringToSign = ts + method + path;
    const signature = crypto.createHmac('sha256', secretKey);
    signature.update(stringToSign);
    signature.update(form.getBuffer());

    const response = await fetch(`https://api.sumsub.com${path}`, {
        method: method,
        headers: {
            'X-Return-Doc-Warnings': 'true',
            'X-App-Token': process.env.SUMSUB_APP_TOKEN || '',
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
            ...form.getHeaders(),
        },
        body: body as any,
    });
    

    const rawData = await response.text();
    if (!response.ok) {
        return res.status(response.status).json({ error: 'API call failed', details: rawData });
    }
    const data = JSON.parse(rawData);
    res.status(200).json(data); 
}
