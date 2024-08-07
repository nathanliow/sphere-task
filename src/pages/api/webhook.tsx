import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { updateKycStatus } from '@/firebase';
import type { Readable } from 'node:stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // const rawBody = await buffer(req);
    const rawBody = await getRawBody(req);
    const sig = req.headers['x-payload-digest'];
    const alg = req.headers['x-payload-digest-alg'];
    const secretKey = process.env.SUMSUB_WEBHOOK_SECRET_KEY || '';
    let algorithm: string;
      switch (alg) {
        case 'HMAC_SHA1_HEX':
          algorithm = 'sha1';
          break;
        case 'HMAC_SHA256_HEX':
          algorithm = 'sha256';
          break;
        case 'HMAC_SHA512_HEX':
          algorithm = 'sha512';
          break;
        default:
          return res.status(400).send('Unsupported HMAC algorithm');
      }
    const calculatedDigest = crypto
        .createHmac(algorithm, secretKey)
        .update(rawBody)
        .digest('hex')

    if (calculatedDigest !== sig) {
      return res.status(400).send(`Invalid signature: ${algorithm}: ${calculatedDigest} !== ${sig}`);
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

async function getRawBody(readable: Readable): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }