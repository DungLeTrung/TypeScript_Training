import mongoose from "mongoose";
import { IProject, IProjectListResponse } from "../../interface/project.interface";
import { Project } from "../../models/project.model";
import { User } from "../../models/user.model";
import { IUser, IUserListResponse, IUserUpdate } from "../../interface/user.interface";
import { parseDate, USER_ROLE } from "../../utils/const";
import { v4 as uuidv4 } from 'uuid';
import { REGEX } from "../../utils/regex";

const listUsers = async (page: number, limit: number): Promise<IUserListResponse> => {
  try {
    const skip = (page - 1) * limit;
    
    const total = await User.countDocuments({ deletedAt: null, role: USER_ROLE.USER }).exec();

    const users = await User.find({ deletedAt: null, role: USER_ROLE.USER })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .exec();

    return { users, total };
  } catch (error) {
    throw new Error(`Failed to list users!!!`);
  }
};

const detailUser = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format.');
  }

  try {
    const user = await User.findById({userId, deletedAt: null})
      .select('-password') 
      .populate('projects', 'name slug start_date end_date total_task process') // Populate projects with selected fields
      .exec();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to retrieve user`);
  }
};

const deleteUser = async (userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId);
    if(!user) {
      throw new Error('User not found')
    }

    if (user.role === USER_ROLE.ADMIN) {
      throw new Error('Cannot delete admin account.');
    }
  
  try {
    const result = await User.findByIdAndUpdate(
      userId,
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    return result !== null;
  } catch (error) {
    throw new Error(`Failed to delete user!!!`);
  }
};

const updateUser = async (_id: string, userData: IUserUpdate): Promise<IUserUpdate> => {
  if (!_id) {
    throw new Error('Id must be required.');
  }

  const dateOfBirth = typeof userData.date_of_birth === 'string' ? new Date(userData.date_of_birth) : userData.date_of_birth;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid user ID format.');
  }

  if (dateOfBirth && dateOfBirth > new Date()) {
    throw new Error('date_of_birth cannot be a future date.');
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, userData, { new: true }).exec();
    return updatedUser as IUser
  } catch (error) {
    throw new Error(`Failed to update user`);
  }
}

const createInviteId = async (): Promise<string> => {
  const inviteId = uuidv4(); 

  const existingInvite = await User.findOne({ invite_id: inviteId }).exec();
  if (existingInvite) {
    return createInviteId();
  }

  return inviteId;
};

export const createUserWithInvite = async (
  username: string,
  password: string,
  role: string,
  projectId: string, 
  name?: string,
  email?: string,
  date_of_birth?: Date
): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID format.');
  }

  if (!REGEX.USERNAME.test(username)) {
    throw new Error('Username must be greater than 5 characters.');
  }

  if(!REGEX.PASSWORD.test(password)){
    throw new Error('Password must be at least 8 characters long and include at least one special character.');
  }

  const userExisting = await User.findOne({ username }).exec();
  if (userExisting != null) {
    throw new Error('User already exists.');
  }

  const userEmail = await User.findOne({ email }).exec();
  if (userEmail != null) {
    throw new Error('Email is empty or duplicate!!!');
  }

  const dateOfBirth = typeof date_of_birth === 'string' ? new Date(date_of_birth) : date_of_birth;

  if (dateOfBirth && dateOfBirth > new Date()) {
    throw new Error('date_of_birth cannot be a future date.');
  }

  try {
    const inviteId = await createInviteId();

    const newUser = new User({
      username,
      password,
      role,
      name,
      email,
      date_of_birth: dateOfBirth,
      invite_id: inviteId,
      is_active: true,
      projects: [projectId]  
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Failed to create user`);
  }
};

export default {
  listUsers, detailUser, deleteUser, updateUser, createUserWithInvite
}