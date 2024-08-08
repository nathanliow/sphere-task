import { buffer } from 'micro'
import getRawBody from 'raw-body'
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { updateKycStatus } from '@/firebase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const rawBody = await buffer(req);
    const sigHeader = req.headers['x-payload-digest'];
    const sig = (Array.isArray(sigHeader) ? sigHeader[0] : sigHeader) || '';
    const secretKey = process.env.SUMSUB_WEBHOOK_SECRET_KEY || '';

    const calculatedDigest = crypto.createHmac('sha256', secretKey)
        .update(rawBody)
        .digest('hex');

    // if (calculatedDigest !== sig) {
    //     return res.status(400).send(`Invalid signature: ${calculatedDigest} !== ${sig}\n${rawBody}`);
    // }

    if (!verifySignature(rawBody, sig, secretKey)) {
        return res.status(400).send(`Invalid signature: ${Buffer.from(crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex'), 'utf8')} !== ${Buffer.from(sig, 'utf8')}\n${rawBody}`);
    }

    const body = JSON.parse(rawBody.toString());
    const { externalUserId, reviewResult } = body;

    if (!externalUserId || !reviewResult) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const reviewAnswer = reviewResult.reviewAnswer;
    const moderationComment = reviewResult.moderationComment;;

    let newKycStatus = "incomplete";
    if (reviewAnswer === 'GREEN') {
        newKycStatus = 'approved';
    } else {
        if (reviewResult.reviewRejectType == "RETRY") {
            newKycStatus = 'tempReject';
        } else if (reviewResult.reviewRejectType == "FINAL") {
            newKycStatus = 'finalReject';
        }
    }
    
    // update user kycStatus
    try {
        await updateKycStatus(externalUserId, newKycStatus);
        // res.status(200).json({ message: 'KYC status updated successfully' });
    } catch (error) {
        console.error('Error updating KYC status:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).send('Webhook received');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method Not Allowed`);
  }
}

export const verifySignature = (rawBody: Buffer, signature: string, secret: string): boolean => {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const receivedSignature = Buffer.from(signature, 'utf8');

    return crypto.timingSafeEqual(digest, receivedSignature);
};