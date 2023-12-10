

import { api } from '$/utils/api';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<User[]>
) {
    const userData = api.user.userList.useQuery();
    const usersList = userData.data;
    if(usersList) res.status(200).json(usersList);
}


