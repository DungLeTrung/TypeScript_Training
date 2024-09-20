import express from 'express';
import authController from '../../module/auth/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authController.login);   

authRouter.post('/register', authController.register);   


export default authRouter;