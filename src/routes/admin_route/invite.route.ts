import express from 'express';
import inviteController from '../../module/invite/invite.controller';
import { protectedRoute } from '../../middleware/protectedRoute';

const inviteRoute = express.Router();

inviteRoute.post('/create-invite', protectedRoute(['admin']), inviteController.createInvite);   


export default inviteRoute; 