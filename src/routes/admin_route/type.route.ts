import express from 'express';
import typeController from '../../module/type/type.controller';

const typeRouter = express.Router();

typeRouter.post('/create-type', typeController.createType);   

typeRouter.get('/list-types', typeController.listTypes);   

typeRouter.put('/edit-type', typeController.editType);   

typeRouter.put('/hiding-type/:id', typeController.hidingType);   


export default typeRouter;