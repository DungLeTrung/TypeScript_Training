import { Request, Response } from 'express';
import { IUser, IUserResponse, IUserUpdate } from '../../interface/user.interface';
import userService from './user.service';

const createInvite = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role, projectId, name, email, date_of_birth } = req.body;

  try {
    const newUser = await userService.createUserWithInvite(username, password, role, projectId, name, email, date_of_birth);
    res.status(201).json({
      message: 'User created successfully.',
      data: newUser,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const listUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, users } = await userService.listUsers(page, limit);

    const response: IUserResponse = {
      message: 'Users retrieved successfully.',
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const detailUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const project = await userService.detailUser(userId);
    res.status(200).json({
      message: 'User retrieved successfully.',
      data: project,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  try {
    const success = await userService.deleteUser(userId);

    res.status(200).json({
      message: 'User deleted successfully.',
      status: success,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & IUserUpdate = req.body

  try {
    const updatedUser = await userService.updateUser(_id, updateData);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};


export default {
  createInvite, listUsers, detailUser, deleteUser, updateUser
};