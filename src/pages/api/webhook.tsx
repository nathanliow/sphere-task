import { buffer } from 'micro'
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
        try {
            const rawBody = await buffer(req);
            const sig = req.headers['x-payload-digest'];
            const secretKey = process.env.SUMSUB_WEBHOOK_SECRET_KEY || '';
            const calculatedDigest = crypto.createHmac("sha256", secretKey)
                .update(rawBody)
                .digest('hex');

            const body = JSON.parse(rawBody.toString());
            const { externalUserId, reviewResult } = body;

            // if (calculatedDigest !== sig) {
            //     return res.status(400).send(`Invalid signature`);
            // }

            if (!externalUserId || !reviewResult) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const reviewAnswer = reviewResult.reviewAnswer;

            let newKycStatus = "pending";
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
            await updateKycStatus(externalUserId, newKycStatus, reviewResult);
            res.status(200).json({ message: 'KYC status updated successfully' });
        } catch (error) {
            console.error('Error updating KYC status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end(`Method Not Allowed`);
    }
}