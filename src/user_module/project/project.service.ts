import mongoose from "mongoose";
import { IProject, IProjectListResponse } from "../../interface/project.interface";
import { Project } from "../../models/project.model";
import { User } from "../../models/user.model";

const listProjects = async (user_id: string, page: number, limit: number): Promise<IProjectListResponse> => {
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
      .skip(skip)
      .limit(limit)
      .exec();

    return { projects, total };
  } catch (error) {
    throw new Error(`Failed to list projects: ${(error as Error).message}`);
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

export default {
  listProjects, detailProject
}