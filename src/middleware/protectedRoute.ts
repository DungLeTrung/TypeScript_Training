import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { CustomRequest } from '../interface/config';
dotenv.config()


const secretKey = process.env.SECRET_KEY_JWT ?? 'Justascret';

export const protectedRoute = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token is missing.' });
    }

    const decodedToken = jwt.verify(token, secretKey) as { user: { _id: string; username: string; role: string } };
    req.user = decodedToken.user;  

    try {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
};
