import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    username: string;
    role: string;
  };
}