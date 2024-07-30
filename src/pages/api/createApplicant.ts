import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { firstName, lastName, phone, email } = req.body;

    const response = await fetch('https://api.sumsub.com/resources/applicants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-App-Token': process.env.SUMSUB_APP_TOKEN || '',
        },
        body: JSON.stringify({
            externalUserId: email,
            email: email,
            phone: phone,
            requiredIdDocs: {
                docSets: [
                    {
                        idDocType: 'PASSPORT',
                        country: 'USA',
                    },
                ],
            },
            fixedInfo: {
                firstName: firstName,
                lastName: lastName,
                legalName: 'string',
                gender: 'M',
                dob: 'string',
                placeOfBirth: 'string',
                countryOfBirth: 'string',
                stateOfBirth: 'string',
                country: 'string',
                nationality: 'string',
                addresses: [
                  {
                    country: 'string',
                    postCode: 'string',
                    town: 'string',
                    street: 'string',
                    subStreet: 'string',
                    state: 'string',
                    buildingName: 'string',
                    flatNumber: 'string',
                    buildingNumber: 'string'
                  }
                ],
            }
        }),
    });

    const data = await response.json();
    res.status(200).json(data);
}
