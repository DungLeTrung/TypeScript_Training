import express from 'express';
import authController from '../../user_module/auth/auth.controller';

const authUserRouter = express.Router();

authUserRouter.post('/create-account', authController.createAccount);   

export default authUserRouter;