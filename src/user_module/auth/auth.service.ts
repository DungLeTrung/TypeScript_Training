import { User } from "../../models/user.model";
import { ILoginResult, ILoginUserInput, IUser, IUserListResponse, IUserRegister, IUserUpdate } from "../../interface/user.interface";
import { parseDate, USER_ROLE } from "../../utils/const";
import { v4 as uuidv4 } from 'uuid';
import { REGEX } from "../../utils/regex";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { Invite } from "../../models/invite.model";
import { Project } from "../../models/project.model";

const createAccount = async (userData: { username: string, password: string, name: string, date_of_birth: Date, email: string, invite_id: string }): Promise<IUserRegister> => {
  const { username, password, name, date_of_birth, email, invite_id } = userData;

  try {
    const invite = await Invite.findOne({ invite_id, is_used: false });
    if (!invite) {
      throw new Error('Invalid or already used invite ID.');
    }
  
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists.');
    }

    const dateOfBirth = typeof date_of_birth === 'string' ? new Date(date_of_birth) : date_of_birth;

    if (dateOfBirth && dateOfBirth > new Date()) {
      throw new Error('date_of_birth cannot be a future date.');
    }

    const secretKey = process.env.SALT_ROUNDS;
  if (!secretKey) {
    throw new Error('Secret key is not defined.');
  }

  const saltRounds = parseInt(secretKey);
  if (isNaN(saltRounds)) {
    throw new Error('Secret key is not a valid number.');
  }

  if (!REGEX.PASSWORD.test(password)) {
    throw new Error('Password must be at least 8 characters long and include at least one special character.');
  }

  const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashPassword,
      name,
      date_of_birth,
      email,
      role: USER_ROLE.USER, 
      projects: [invite.project] 
    });

    const savedUser = await newUser.save();

    invite.is_used = true;
    await invite.save();

    await Project.findByIdAndUpdate(
      invite.project, 
      { $push: { users: savedUser._id } }, 
      { new: true }
    );

    return {
      ...savedUser.toObject(),
      password: 'Private',
    };

  } catch (error) {
    throw new Error(`Failed to create user with invite: ${(error as Error).message}`);
  }
};


export default {
  createAccount
};
