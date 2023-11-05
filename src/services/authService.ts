import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';

const secret = 'blah blah blah files';

export const signUserToken = async (user: User) => {
  let token = jwt.sign(
      { userId: user.userId },
      secret,
      { expiresIn: '30d' }
  );
  
  return token;
}

export const verifyUser = async (req: Request) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // If header exists, parse token from `Bearer <token>`
  if (authHeader) {
      const token = authHeader.split(' ')[1];

      // Verify the token and get the user
      try {
          let decoded: any = await jwt.verify(token, secret);
          return User.findByPk(decoded.userId);
      }
      catch (err) {
          return null;
      }
  }
  else {
      return null;
  }
}

export const verifyToken = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || 'default_secret_key');
    return decoded;
  } catch (err) {
    return null;
  }
};
