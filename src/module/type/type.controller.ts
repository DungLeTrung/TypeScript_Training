import { Request, Response } from 'express';
import typeService from './type.service';
import { IType, ITypeResponse } from '../../interface/type.interface';

const createType = async (req: Request, res: Response) => {
  try {
    const { type, color } = req.body;
    const taskType = await typeService.createType(type, color);
    res.status(201).json(
      { 
        message: 'Task type created successfully.', 
        data: taskType 
      }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const listTypes = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, types } = await typeService.listTypes(page, limit);

    const response: ITypeResponse = {
      message: 'Types retrieved successfully.',
      data: types,
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

 const editType = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & IType = req.body;

  if (!_id) {
    res.status(400).json({ message: 'Type ID is required.' });
    return;
  }

  try {
    const updatedProject = await typeService.editType(_id, updateData);

    if (!updatedProject) {
      res.status(404).json({ message: 'Type not found.' });
      return;
    }

    res.status(200).json({
      message: 'Type updated successfully.',
      data: updatedProject,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const hidingType = async (req: Request, res: Response): Promise<void> => {
  const typeId = req.params.id;
  try {
    const success = await typeService.hidingType(typeId);

    res.status(200).json({
      message: 'Hiding type successfully.',
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
  createType, listTypes, editType, hidingType
};