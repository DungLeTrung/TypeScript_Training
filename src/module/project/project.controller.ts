import { Request, Response } from 'express';
import { IEditProject, IProject, IProjectResponse } from '../../interface/project.interface';
import projectService from './project.service';

const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, slug, users, start_date, tasks, end_date, total_task, process }: IProject = req.body;

  try {
      const loginUser = await projectService.createProject({ name, slug, users, start_date, tasks, end_date, total_task, process });
      res.status(200).json({
          message: 'Project created successfully.',
          data: loginUser,
      });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const listProjects = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, projects } = await projectService.listProjects(page, limit);

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
  const projectId = req.params.id;

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

 const editProject = async (req: Request, res: Response): Promise<void> => {
  const { _id, ...updateData }: { _id: string } & IEditProject = req.body;

  if (!_id) {
    res.status(400).json({ message: 'Project ID is required.' });
    return;
  }

  try {
    const updatedProject = await projectService.editProject(_id, updateData);

    if (!updatedProject) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }

    res.status(200).json({
      message: 'Project updated successfully.',
      data: updatedProject,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
    res.status(400).json({
        message: errorMessage,
    });
  }
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.id;
  try {
    const success = await projectService.deleteProject(projectId);

    res.status(200).json({
      message: 'Project deleted successfully.',
      status: success,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
      });
  }
};

const addMembersToProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;
  const userId = req.body.userId; 

  try {
    const success = await projectService.addMembersToProject(projectId, userId)

    res.status(200).json({
      message: 'User added to project successfully.',
      status: success,
    });  
  } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
    });  
  }
};

const deleteMemberFromProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;
  const userId = req.params.userId; 

  try {
    const success = await projectService.deleteMemberFromProject(projectId, userId)

    res.status(200).json({
      message: 'User has been removed successfully.',
      status: success,
    });  
  } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
    });  
  }
};

const deleteMembersFromProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;
  const userId: string[] = req.body.userIds; 

  try {
    const success = await projectService.deleteMembersFromProject(projectId, userId)

    res.status(200).json({
      message: 'Remove users successfully.',
      status: success,
    });  
  } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred.';
      res.status(400).json({
          message: errorMessage,
    });  
  }
};

const listProjectsByUserId = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const page = parseInt(req.query.page as string, 10) || 1; 
  const limit = parseInt(req.query.limit as string, 10) || 10; 

  try {
    const { total, projects } = await projectService.listProjectsByUserId(userId, page, limit);

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


export default {
  createProject, listProjects, detailProject, editProject, deleteProject, addMembersToProject, deleteMemberFromProject, deleteMembersFromProject, listProjectsByUserId
};