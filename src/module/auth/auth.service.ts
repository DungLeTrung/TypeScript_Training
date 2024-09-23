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
    if (!userExisting) {
      throw new Error('Wrong user!!!');
    }

    if(!userExisting?.is_active) {
      throw new Error('User has been banned!!!.');
    }

    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) {
        throw new Error('Incorrect username or password.');
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
    }, secretKey, { expiresIn: '5d' });
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

export const register = async ({
  username,
  password,
  name,
  email,
  date_of_birth,
  invite_id,
}: IUserRegister): Promise<any> => {
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).exec();
    if (existingUser) {
      throw new Error('Username or email already exists.');
    }
    
    const saltRounds = parseInt(process.env.SALT_ROUNDS ?? '10');
    const hashPassword = await bcrypt.hash(password, saltRounds);

    if (invite_id) {
      const invite = await Invite.findOne({ invite_id, is_used: false });
      if (!invite) {
        throw new Error('Invalid or already used invite ID.');
      }

      const newUser = new User({
        username,
        password: hashPassword,
        name,
        date_of_birth,
        email,
        role: USER_ROLE.USER,
        projects: [invite.project], 
      });

      const savedUser = await newUser.save();

      invite.is_used = true;
      await invite.save();

      await Project.findByIdAndUpdate(invite.project, { $push: { users: savedUser._id } }, { new: true });

      return {
        ...savedUser.toObject(),
        password: 'Private',
      };

    } else {
      const newUser = await User.create({
        username,
        name,
        email,
        date_of_birth,
        password: hashPassword,
        role: USER_ROLE.USER,
      });

      return {
        ...newUser.toObject(),
        password: 'Private',
      };
    }
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};
export default {
  login, register
};