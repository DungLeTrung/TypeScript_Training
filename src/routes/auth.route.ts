import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import authController from '../module/auth/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authController.login);   

authRouter.post('/register', authController.register);   

authRouter.post('/create-account', protectedRoute(['ADMIN']), authController.createAccountThroughInviteId);   

export default authRouter;