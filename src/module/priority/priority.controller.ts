import { Request, Response } from 'express';
import { IType } from '../../interface/type.interface';
import priorityService from './priority.service';
import { IPriority, IPriorityResponse } from '../../interface/priority.interface';

const createPriority = async (req: Request, res: Response) => {
  try {
    const { type, position } = req.body;
    const taskPriority = await priorityService.createPriority(type, position);
    res.status(201).json(
      { 
        message: 'Priority created successfully.', 
        data: taskPriority 
      }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const listPriorities = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, priorities } = await priorityService.listPriorities(page, limit);

    const response: IPriorityResponse = {
      message: 'Priorities retrieved successfully.',
      data: priorities,
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

 const editPriority = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & IPriority = req.body;

  if (!_id) {
    res.status(400).json({ message: 'Priority ID is required.' });
    return;
  }

  try {
    const updatedPriority = await priorityService.editPriority(_id, updateData);

    if (!updatedPriority) {
      res.status(404).json({ message: 'Priority not found.' });
      return;
    }

    res.status(200).json({
      message: 'Priority updated successfully.',
      data: updatedPriority,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const hidingPriority = async (req: Request, res: Response): Promise<void> => {
  const typeId = req.params.id;
  try {
    const success = await priorityService.hidingPriority(typeId);

    res.status(200).json({
      message: 'Hiding priority successfully.',
      status: success,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const getPriorityById = async (req: Request, res: Response): Promise<void> => {
  const priorityId = req.params.id;
  try {
    const success = await priorityService.getPriorityById(priorityId);

    res.status(200).json({
      message: 'get priority successfully.',
      data: success,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};


export default {
  createPriority, listPriorities, editPriority, hidingPriority, getPriorityById
};