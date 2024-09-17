import bcrypt from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { parseDate, USER_ROLE } from '../utils/const';
import { ILoginUserInput, IUser, IUserRegister } from '../interface/user.interface';
import { User } from '../models/user.model';
import { REGEX } from '../utils/regex';

export const login = async ({ username, password }: ILoginUserInput, res: Response): Promise<any> => {
    const userExisting: IUser | null = await User.findOne({ username }).exec();
    
    if (!userExisting) {
        throw new Error('User does not exist.');
    }

    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) {
        throw new Error('Incorrect email or password.');
    }

    const secretKey = process.env.SECRET_KEY_JWT;
    if (!secretKey) {
        throw new Error('Secret key for JWT is not defined.');
    }

    const accessToken = jwt.sign({ data: userExisting.username }, secretKey, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ data: userExisting.username }, secretKey, { expiresIn: '30d' }); 

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

  const parsedDateOfBirth = typeof date_of_birth === 'string'
    ? parseDate(date_of_birth)
    : date_of_birth;

  if (isNaN(parsedDateOfBirth.getTime())) {
    throw new Error('The date_of_birth is invalid.');
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
    date_of_birth: parsedDateOfBirth,
    invite_id,
    password: hashPassword,
    role: USER_ROLE.USER,
  });

  return {
    ...newUser.toObject(),
    password: 'Not shown',
  };
};

export default {
  login, register
};