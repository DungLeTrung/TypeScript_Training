import { Request, Response } from 'express';
import taskService from './task.service';
import { ITask, ITaskResponse } from '../../interface/task.interface';
import { CustomRequest } from '../../interface/config';

const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const customReq = req as CustomRequest;

    const taskData = req.body;
    const newTask = await taskService.createTask(customReq, taskData);
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
  try {
    const { _id, ...updateData }: { _id: string } & ITask = req.body;

    const customReq = req as CustomRequest;
  
    if (!_id) {
      res.status(400).json({ message: 'Task ID is required.' });
      return;
    }

    const updatedProject = await taskService.editTask(_id, customReq, updateData);

    if (!updatedProject) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    res.status(200).json({
      message: 'Task updated successfully.',
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
  try {
    const customReq = req as CustomRequest;
    const taskId = req.params.id;

    const success = await taskService.deleteTask(taskId);

    res.status(200).json({
      message: 'Delete task successfully.',
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

const getTasksByProjectId = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 
  const project_id = req.params.projectId
  try {
    const { total, tasks } = await taskService.getTasksByProjectId(project_id, page, limit);

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

const detailTask = async (req: Request, res: Response): Promise<void> => {
  const taskId = req.params.taskId;

  try {
    const project = await taskService.detailTask(taskId);
    res.status(200).json({
      message: 'Project retrieved successfully.',
      data: project,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};


const getTasksByUserId = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 
  const user_id = req.params.userId
  try {
    const { total, tasks } = await taskService.getTasksByUserId(user_id, page, limit);

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
  createTask, editTask, deleteTask, listTasks, getTasksByProjectId, detailTask, getTasksByUserId
}