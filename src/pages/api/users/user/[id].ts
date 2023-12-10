import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '$/utils/api'

export default function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { query, method } = req
  const id = query.id as string;

  switch (method) {
    case 'GET':
      const userReq = api.user.userById.useQuery({id: id});
      const userData = userReq.data;
      if(userData) return res.status(200).json(userData);
      break
    case 'PUT':
      const userUpdate= req.body;
      api.user.update.useMutation(userUpdate);
      res.status(200).json(userUpdate);
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}