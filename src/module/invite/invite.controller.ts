import { Request, Response } from 'express';
import inviteService from './invite.service';

export const createInvite = async (req: Request, res: Response): Promise<void> => {
  const { project_id } = req.body;

  try {
      const newInvite = await inviteService.createInvite(project_id);
      res.status(200).json({
          message: 'Login successfully.',
          data: newInvite,
      });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

export default {
  createInvite
}