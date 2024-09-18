import mongoose from "mongoose";
import { IProject, IProjectListResponse } from "../../interface/project.interface";
import { Project } from "../../models/project.model";
import { User } from "../../models/user.model";

const createProject = async (projectData: IProject): Promise<IProject> => {
  const userIds = Array.isArray(projectData.users) ? projectData.users : projectData.users ? [projectData.users] : [];
  const taskIds = Array.isArray(projectData.tasks) ? projectData.tasks : projectData.tasks ? [projectData.tasks] : [];

  const startDate = typeof projectData.start_date === 'string' ? new Date(projectData.start_date) : projectData.start_date;
  const endDate = typeof projectData.end_date === 'string' ? new Date(projectData.end_date) : projectData.end_date;

  if (startDate && endDate && startDate >= endDate) {
    throw new Error('start_date must be before end_date.');
  }

  try {
    const newProject = new Project({
      name: projectData.name,
      slug: projectData.slug, 
      users: userIds.length > 0 ? userIds : undefined,
      tasks: taskIds.length > 0 ? taskIds : undefined,
      start_date: projectData.start_date,
      end_date: projectData?.end_date,
      total_task: projectData.total_task,
      process: projectData.process,
    });

    const savedProject = await newProject.save();
    return savedProject;
  } catch (error) {
    throw new Error(`Failed to create project!!!`);
  }
};

const listProjects = async (page: number, limit: number): Promise<IProjectListResponse> => {
  try {
    const skip = (page - 1) * limit;
    
    const total = await Project.countDocuments({ deletedAt: null }).exec();

    const projects = await Project.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .exec();

    return { projects, total };
  } catch (error) {
    throw new Error(`Failed to list projects!!!`);
  }
};

const detailProject = async (projectId: string): Promise<IProject | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID format.');
  }

  try {
    const project = await Project.findById(projectId)
    .populate('users')
    .exec();
    if(!project) {
      throw new Error('Project not found')
    } else {
      return project;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve project!!!`);
  }
};

const editProject = async (_id: string, projectData: IProject): Promise<any> => {
  const startDate = typeof projectData.start_date === 'string' ? new Date(projectData.start_date) : projectData.start_date;
  const endDate = typeof projectData.end_date === 'string' ? new Date(projectData.end_date) : projectData.end_date;

  if (startDate && endDate && startDate >= endDate) {
    throw new Error('start_date must be before end_date.');
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(_id, projectData, { new: true }).exec();
    return updatedProject;
  } catch (error) {
    throw new Error(`Failed to update project`);
  }
}

const deleteProject = async (projectId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID format.');
  }

  const project = await Project.findById(projectId);
    if(!project) {
      throw new Error('Project not found')
    }
  
  try {
    const result = await Project.findByIdAndUpdate(
      projectId,
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    return result !== null;
  } catch (error) {
    throw new Error(`Failed to delete project!!!`);
  }
};

const addMembersToProject = async (projectId: string, userId: string): Promise<IProject | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid project ID or user ID format.');
  }

  const project = await Project.findById(projectId).exec();
    if (!project) {
      throw new Error('Project not found.');
    }

    const user = await User.findById(userId).exec();
    if (!user) {
      throw new Error('User not found.');
    }
    if (user.deletedAt) {
      throw new Error('Cannot add a deleted user to the project.');
    }

    if (project.users?.some(user => user.toString() === userId)) {
      throw new Error('User already added to this project.');
    }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { users: userId } }, 
      { new: true } 
    ).exec();
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { projects: projectId } }, 
      { new: true }
    ).exec();
    return updatedProject;
  } catch (error) {
    throw new Error(`Failed to add user to project`);
  }
}

const deleteMemberFromProject = async (projectId: string, userId: string): Promise<IProject | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid project ID or user ID format.');
  }

  const project = await Project.findById(projectId).exec();
  if (!project) {
    throw new Error('Project not found.');
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    throw new Error('User not found.');
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { users: userId } }, 
      { new: true } 
    ).exec();

    if (!updatedProject) {
      throw new Error('Project not found.');
    }

    return updatedProject;
  } catch (error) {
    throw new Error(`Failed to remove user from project`);
  }
}

const deleteMembersFromProject = async (projectId: string, userIds: string[]): Promise<IProject | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !Array.isArray(userIds) || userIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    throw new Error('Invalid project ID or user ID format.');
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pullAll: { users: userIds } }, 
      { new: true } 
    ).exec();

    if (!updatedProject) {
      throw new Error('Project not found.');
    }

    return updatedProject;
  } catch (error) {
    throw new Error(`Failed to remove users from project`);
  }
};

export default {
  createProject, listProjects, detailProject, editProject, deleteProject, addMembersToProject, deleteMemberFromProject, deleteMembersFromProject
}