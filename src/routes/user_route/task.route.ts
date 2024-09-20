import express from 'express';
import taskController from '../../user_module/task/task.controller';

const taskRouterForUser = express.Router();

taskRouterForUser.post('/create-task', taskController.createTask);   

taskRouterForUser.get('/list-tasks/:projectId', taskController.listTasks);   

taskRouterForUser.put('/edit-task', taskController.editTask);   

taskRouterForUser.delete('/delete-task/:id', taskController.deleteTask);   


export default taskRouterForUser;