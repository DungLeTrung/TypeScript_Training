import { Request, Response } from 'express';
import { ILoginUserInput, IUserRegister } from '../../interface/user.interface'; // Import the input interface
import authService from './auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password }: ILoginUserInput = req.body;

    try {
        const loginUser = await authService.login({ username, password }, res);
        res.status(200).json({
            message: 'Login successfully.',
            data: loginUser,
        });
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred.';
        res.status(400).json({
            message: errorMessage,
        });
    }
};

const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, email, date_of_birth, invite_id  }: IUserRegister = req.body;

  try {
    const newUser = await authService.register({ username, password, name, email, date_of_birth, invite_id  });
    res.status(201).json({
      message: 'Register successfully.',
      data: {
        ...newUser,
        password: 'Private' 
      },
    });
  } catch (error) {
    res.status(400).json({
      errors: (error as Error).toString(),
    });
  }
};

const createAccountThroughInviteId = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, date_of_birth, email, invite_id } = req.body;

  try {
    const newUser = await authService.createAccountThroughInviteId({ username, password, name, date_of_birth, email, invite_id });

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
  login, register, createAccountThroughInviteId
};