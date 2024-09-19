import { Request, Response } from 'express';
import taskService from './task.service';
import { ITask, ITaskResponse } from '../../interface/task.interface';

const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskData = req.body;
    const newTask = await taskService.createTask(taskData);
    res.status(201).json({
      message: 'Task created successfully.',
      data: newTask
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });  
  }
};

const editTask = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & ITask = req.body;

  if (!_id) {
    res.status(400).json({ message: 'Task ID is required.' });
    return;
  }

  try {
    const updatedProject = await taskService.editTask(_id, updateData);

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

const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const taskId = req.params.id;
  try {
    const success = await taskService.deleteTask(taskId);

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

const listTasks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, tasks } = await taskService.listTasks(page, limit);

    const response: ITaskResponse = {
      message: 'Task retrieved successfully.',
      data: tasks,
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


export default {
  createTask, editTask, deleteTask, listTasks
}