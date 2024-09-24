import mongoose from "mongoose";
import { IEditProject, IProject, IProjectListResponse } from "../../interface/project.interface";
import { Project } from "../../models/project.model";
import { User } from "../../models/user.model";
import { Task } from "../../models/task.model";

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
    
    const total = await Project.countDocuments().exec();

    const projects = await Project.find()
      .populate('users', 'name email') 
      .populate({
        path: 'tasks', 
        select: 'name status priority type start_date end_date', 
        populate: [{
          path: 'type',
          select: 'type' 
        },
        {
          path: 'status',
          select: 'type' 
        },
        {
          path: 'priority',
          select: 'type' 
        },
        ]
      })    
      .skip(skip)
      .limit(limit)
      .exec();

    return { projects, total };
  } catch (error) {
    throw new Error(`Failed to list projects!!!`);
  }
};

const detailProject = async (projectId: string): Promise<IProject | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format.');
    }

    const project = await Project.findOne({_id: projectId }) 
      .select('-users.password') 
      .populate('users', 'name email') 
      .populate({
        path: 'tasks',
        select: 'name assignees start_date end_date status type priority',
        populate: [
          {
            path: 'status',
            select: 'type',
          },
          {
            path: 'type',
            select: 'type',
          },
          {
            path: 'priority',
            select: 'type',
          },
        ],
      })      
      .exec();
    if(!project) {
      throw new Error('Project not found')
    } else {
      return project;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve project: ${(error as Error).message}`);
  }
};

const editProject = async (_id: string, projectData: IEditProject): Promise<any> => {
  try {
    const startDate = typeof projectData.start_date === 'string' ? new Date(projectData.start_date) : projectData.start_date;
    const endDate = typeof projectData.end_date === 'string' ? new Date(projectData.end_date) : projectData.end_date;
  
    if (startDate && endDate && startDate >= endDate) {
      throw new Error('start_date must be before end_date.');
    }
  
    const updatedProject = await Project.findByIdAndUpdate(_id, projectData, { new: true }).exec();
    return updatedProject;
  } catch (error) {
    throw new Error(`Failed to update project`);
  }
}

const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format.');
    }
  
    const project = await Project.findById(projectId);
      if(!project) {
        throw new Error('Project not found')
      }  

    const result = await Project.deleteOne(
      {_id: projectId}).exec();

      await Task.updateMany(
        { project: projectId },
        { $set: { project: null } }
      ).exec();

      await User.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
      ).exec();
    return result !== null;
  } catch (error) {
    throw new Error(`Failed to delete project: ${(error as Error).message}`);
  }
};

const addMembersToProject = async (projectId: string, userId: string): Promise<IProject | null> => {
  try {
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
  
      if (project.users?.some(user => user.toString() === userId)) {
        throw new Error('User already added to this project.');
      }  

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
    throw new Error(`Failed to add user to project: ${(error as Error).message}`);
  }
}

const deleteMemberFromProject = async (projectId: string, userId: string): Promise<IProject | null> => {
  try {
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
    throw new Error(`Failed to remove user from project: ${(error as Error).message}`);
  }
}

const deleteMembersFromProject = async (projectId: string, userIds: string[]): Promise<IProject | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !Array.isArray(userIds) || userIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('Invalid project ID or user ID format.');
    }

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
    throw new Error(`Failed to remove users from project: ${(error as Error).message}`);
  }
};

const listProjectsByUserId = async (user_id: string, page: number, limit: number): Promise<IProjectListResponse> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      throw new Error('Invalid priority ID format.');
    }
  
    const existingUser = await User.findById(user_id);
    if(!existingUser) {
      throw new Error('User is not exist.');
    }
    
    const skip = (page - 1) * limit;
    
    const total = await Project.countDocuments({users: user_id}).exec();

    const projects = await Project.find({users: user_id})
    .populate({
      path: 'users',
      select: 'name email'
    })
    .populate({
      path: 'tasks',
      select: 'name assignees start_date end_date status type priority',
      populate: [
        {
          path: 'status',
          select: 'type',
        },
        {
          path: 'type',
          select: 'type',
        },
        {
          path: 'priority',
          select: 'type',
        },
      ],
    })
      .skip(skip)
      .limit(limit)
      .exec();

    return { projects, total };
  } catch (error) {
    throw new Error(`Failed to list projects: ${(error as Error).message}`);
  }
};

export default {
  createProject, listProjects, detailProject, editProject, deleteProject, addMembersToProject, deleteMemberFromProject, deleteMembersFromProject, listProjectsByUserId
}