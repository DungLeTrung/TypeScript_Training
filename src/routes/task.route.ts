import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import taskController from '../module/task/task.controller';

const taskRouter = express.Router();

taskRouter.post('/create-task', taskController.createTask);   

taskRouter.get('/list-tasks',  protectedRoute(['ADMIN']), taskController.listTasks);   

taskRouter.put('/edit-task', taskController.editTask);   

taskRouter.delete('/delete-task/:id',  protectedRoute(['ADMIN']), taskController.deleteTask);   

taskRouter.get('/list-tasks/:projectId', taskController.getTasksByProjectId);   



export default taskRouter;