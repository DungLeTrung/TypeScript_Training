import { Request, Response } from 'express';
import { IProject, IProjectResponse } from '../../interface/project.interface';
import projectService from './project.service';

const listProjects = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, projects } = await projectService.listProjects(userId, page, limit);

    const response: IProjectResponse = {
      message: 'Projects retrieved successfully.',
      data: projects,
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

const detailProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;

  try {
    const project = await projectService.detailProject(projectId);
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




export default {
  listProjects, detailProject
};