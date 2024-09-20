import express from 'express';
import statusController from '../../module/status/status.controller';

const statusRouter = express.Router();

statusRouter.post('/create-status', statusController.createStatus);   

statusRouter.get('/list-statuses', statusController.listStatuses);   

statusRouter.put('/edit-status', statusController.editStatus);   

statusRouter.put('/hiding-status/:id', statusController.hidingStatus);   


export default statusRouter;