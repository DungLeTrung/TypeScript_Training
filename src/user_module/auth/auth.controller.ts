import { Request, Response } from 'express';
import { ILoginUserInput, IUserResponse } from '../../interface/user.interface';
import authService from './auth.service';

const createAccount = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, date_of_birth, email, invite_id } = req.body;

  try {
    const newUser = await authService.createAccount({ username, password, name, date_of_birth, email, invite_id });

    res.status(201).json({
      message: 'User created successfully.',
      data: newUser
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

export default {
  createAccount
};