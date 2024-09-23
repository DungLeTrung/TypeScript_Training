import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    username: string;
    role: string;
  };
}