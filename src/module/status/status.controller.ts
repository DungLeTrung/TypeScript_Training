import { Request, Response } from 'express';
import { IType } from '../../interface/type.interface';
import statusService from './status.service';
import { IStatus, IStatusResponse } from '../../interface/status.interface';

const createStatus = async (req: Request, res: Response): Promise<void> => {
  const { type, position } = req.body;

  try {
    const newStatus = await statusService.createStatus(type, position);
    res.status(201).json({
      message: 'Status created successfully.',
      data: newStatus,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });  
  }
};

const listStatuses = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, statuses } = await statusService.listStatuses(page, limit);

    const response: IStatusResponse = {
      message: 'Status retrieved successfully.',
      data: statuses,
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
    });  }
};

 const editStatus = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & IStatus = req.body;

  if (!_id) {
    res.status(400).json({ message: 'Status ID is required.' });
    return;
  }

  try {
    const updatedProject = await statusService.editStatus(_id, updateData);

    if (!updatedProject) {
      res.status(404).json({ message: 'Status not found.' });
      return;
    }

    res.status(200).json({
      message: 'Status updated successfully.',
      data: updatedProject,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const hidingStatus = async (req: Request, res: Response): Promise<void> => {
  const statusId = req.params.id;
  try {
    const success = await statusService.hidingStatus(statusId);

    res.status(200).json({
      message: 'Hiding Status successfully.',
      status: success,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};


export default {
  createStatus, listStatuses, editStatus, hidingStatus
};