import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import authController from '../module/auth/auth.controller';
import { validateRegister } from '../middleware/registerValidate';
import { validateLogin } from '../middleware/loginValidate';

const authRouter = express.Router();

authRouter.post('/login', validateLogin, authController.login);   

authRouter.post('/register', validateRegister, authController.register);   

export default authRouter;