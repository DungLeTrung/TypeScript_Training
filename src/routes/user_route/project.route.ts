import express from 'express';
import projectController from '../../user_module/project/project.controller';

const projectRouterForUser = express.Router();

projectRouterForUser.get('/list-projects/:id', projectController.listProjects);   

projectRouterForUser.get('/detail-project/:projectId', projectController.detailProject);   

export default projectRouterForUser;