import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { connect } from 'mongoose';
import { UserModel } from '../../schemas/user';

connect(process.env.MONGODB_URL as string);

export default async function shows(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req, secret });

  if (token) {
    try {
      // get the user's SOL wallet address from the query string
      const r = req.query;
      const { name } = token;
      const solAddress = r.a as string;

      // update the user's SOL wallet address
      // eslint-disable-next-line max-len
      await UserModel().findOneAndUpdate({ name }, { sol_address: solAddress }).exec();

      // return the SOL wallet address
      res.send({ sol_address: solAddress });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(401).json({ error: 'access denied' });
  }
}
