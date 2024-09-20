import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import inviteController from '../module/invite/invite.controller';

const inviteRoute = express.Router();

inviteRoute.post('/create-invite', protectedRoute(['ADMIN']), inviteController.createInvite);   


export default inviteRoute; 