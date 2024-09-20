import bcrypt from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { ILoginResult, ILoginUserInput, IUser, IUserRegister } from '../../interface/user.interface';
import { User } from '../../models/user.model';
import { parseDate, USER_ROLE } from '../../utils/const';
import { REGEX } from '../../utils/regex';
import { Invite } from '../../models/invite.model';
import { Project } from '../../models/project.model';

export const login = async ({ username, password }: ILoginUserInput, res: Response): Promise<ILoginResult> => {
    const userExisting: IUser | null = await User.findOne({ username });

    if (!REGEX.USERNAME.test(username)) {
      throw new Error('Username must be greater than 5 characters.');
    }

    if(!REGEX.PASSWORD.test(password)){
      throw new Error('Password must be at least 8 characters long and include at least one special character.');
    }

    if(!userExisting?.is_active) {
      throw new Error('User has been banned!!!.');
    }
    
    if (!userExisting) {
        throw new Error('Enter username and password!!!');
    }

    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) {
        throw new Error('Incorrect email or password.');
    }

    const secretKey = process.env.SECRET_KEY_JWT;
    if (!secretKey) {
        throw new Error('Secret key for JWT is not defined.');
    }

    const accessToken = jwt.sign({ 
      user: {
        _id: userExisting._id,
        username: userExisting.username,
        role: userExisting.role, 
      }
    }, secretKey, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ 
      user: {
        _id: userExisting._id,
        username: userExisting.username,
        role: userExisting.role, 
      }
    },  secretKey, { expiresIn: '30d' }); 

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    const cookieValue = `refreshToken=${refreshToken}; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; Path=/`; 
    res.setHeader('Set-Cookie', cookieValue);

    return {
        ...userExisting.toObject(),
        password: 'Private',
        accessToken,
        refreshToken,
    };
};

const register = async ({username, password, name, email, date_of_birth, invite_id
}: IUserRegister): Promise<any> => {
  if (!username || !password) {
    throw new Error('Username and password must be provided.');
  }

  if (!date_of_birth) {
    throw new Error('Date of birth must be provided.');
  }

  const dateOfBirth = typeof date_of_birth === 'string' ? new Date(date_of_birth) : date_of_birth;

  if (dateOfBirth && dateOfBirth > new Date()) {
    throw new Error('date_of_birth cannot be a future date.');
  }

  const userExisting = await User.findOne({ username }).exec();
  if (userExisting != null) {
    throw new Error('User already exists.');
  }

  const userEmail = await User.findOne({ email }).exec();
  if (userEmail != null) {
    throw new Error('Email is empty or duplicate!!!');
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

  const newUser = await User.create({
    username,
    name,
    email,
    date_of_birth: dateOfBirth,
    invite_id,
    password: hashPassword,
    role: USER_ROLE.USER,
  });

  return {
    ...newUser.toObject(),
    password: 'Private',
  };
};

const createAccountThroughInviteId = async (userData: { username: string, password: string, name: string, date_of_birth: Date, email: string, invite_id: string }): Promise<IUserRegister> => {
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
  login, register, createAccountThroughInviteId
};