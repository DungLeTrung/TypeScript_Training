import mongoose from "mongoose";
import { CustomRequest } from "../../interface/config";
import { ITask, ITaskListResponse } from "../../interface/task.interface";
import { Priority } from "../../models/priority.model";
import { Project } from "../../models/project.model";
import { Status } from "../../models/status.model";
import { Task } from "../../models/task.model";
import { Type } from "../../models/type.model";
import { User } from "../../models/user.model";
import { StatusType, USER_ROLE } from "../../utils/const";
import { Request } from "express";

const createTask =  async (req: CustomRequest, taskData: ITask): Promise<ITask> => {
  try {
    const status_closed = await Status.findOne({ type: StatusType.Closed }).exec();

    const { name, project: project_id, start_date, end_date, type: type_id, status: status_id = status_closed?._id, priority: priority_id } = taskData;
    
    let assignees;
    if (req.user?.role === USER_ROLE.USER) {
      assignees = taskData.assignees || req?.user?._id; 
    } else if (req.user?.role === USER_ROLE.ADMIN) {
      if (!taskData.assignees) {
        throw new Error('Admin must provide assignees.');
      }
      assignees = taskData.assignees;
    }  

    const startDate = typeof taskData.start_date === 'string' ? new Date(taskData.start_date) : taskData.start_date;
    const endDate = typeof taskData.end_date === 'string' ? new Date(taskData.end_date) : taskData.end_date;
  
    if (startDate && endDate && startDate >= endDate) {
      throw new Error('start_date must be before end_date.');
    }
  
    if (!name ) {
      throw new Error('Name are required.');
    }
  
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Name must be a non-empty string.');
    }
  
    const user = await User.findOne({
      $or: [
        { _id: assignees },
        { _id: req?.user?._id }
      ]
    });
    
    if (!user) {
      throw new Error('Assignee not found.');
    }
    if (!user.is_active) {
      throw new Error('Assignee is not active.');
    }
  
    const project = await Project.findById(project_id);
    if (!project) {
      throw new Error('Project not found.');
    }
  
    const isAssigneeInProject = await Project.exists({
      _id: project_id,
      users: assignees
    });
  
    if (!isAssigneeInProject) {
      throw new Error('Assignee is not part of the project.');
    }
  
    if (!project.start_date || !project.end_date) {
      throw new Error('Project start_date or end_date is missing.');
    }
  
    if (startDate && (startDate < project.start_date || startDate > project.end_date)) {
      throw new Error('Task start_date must be within the project start_date and end_date.');
    }
  
    if (endDate && (endDate < project.start_date || endDate > project.end_date)) {
      throw new Error('Task end_date must be within the project start_date and end_date.');
    }
    
    if(type_id) {
      const type = await Type.findById(type_id);
      if (!type || type.is_hiding) {
        throw new Error('Type not found.');
      }
    }
    
    if (priority_id) {
      const priority = await Priority.findById(priority_id);
      if (!priority || priority.is_hiding) {
        throw new Error('Priority not found or is hidden.');
      }
    }

    const status = await Status.findById(status_id);
    if (!status || status.is_hiding) {
      throw new Error('Status not found.');
    }
  
      const newTask = new Task({
        name,
        assignees,
        assigneeName: user.name,
        project,
        start_date,
        end_date,
        type: type_id,
        status,
        priority: priority_id
      });
      const savedTask = await newTask.save();
  
      await Project.findByIdAndUpdate(
        project_id,
        { $push: { tasks: savedTask._id }, $inc: { total_task: 1 } },
        { new: true }
      ).exec();
  
      await User.findByIdAndUpdate(
        assignees,
        { $push: { tasks: savedTask._id } },
        { new: true }
      ).exec();

    const closedTasksCount = await Task.countDocuments({ project: project_id, status: status_closed?._id.toString() });

    const totalTasksCountDoc = await Project.findById(project_id).select('total_task').exec();

    if (!totalTasksCountDoc) {
      throw new Error('Project not found.');
    }

    const totalTasksCount = totalTasksCountDoc.total_task != null ? totalTasksCountDoc.total_task : 1;
    const process = closedTasksCount / totalTasksCount;

    await Project.findByIdAndUpdate(
      project_id,
      { process },
      { new: true }
    );
  
      return savedTask;
    } catch (error) {
      throw new Error(`Failed to create task: ${(error as Error).message}`);
    }
};

const editTask = async (_id: string, req: CustomRequest, taskData: ITask): Promise<any> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error('Invalid task ID format.');
    }

    const existingTask = await Task.findById(_id);
    if(!existingTask) {
      throw new Error('Task is not exist.');
    }
  
    const { name = existingTask.name, project: project_id, start_date, end_date, type: type_id, status: status_id, priority: priority_id } = taskData;

    let assignees;
    if (req.user?.role === USER_ROLE.USER) {
      assignees = taskData.assignees || req?.user?._id; 
    } else if (req.user?.role === USER_ROLE.ADMIN) {
      if (!taskData.assignees) {
        throw new Error('Admin must provide assignees.');
      }
      assignees = taskData.assignees;
    } 

    const startDate = typeof start_date === 'string' ? new Date(start_date) : start_date;
    const endDate = typeof end_date === 'string' ? new Date(end_date) : end_date;
  
    if (startDate && endDate && startDate >= endDate) {
      throw new Error('start_date must be before end_date.');
    }
  
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Name must be a non-empty string.');
    }
  
    const user = await User.findOne({
      $or: [
        { _id: assignees },
        { _id: req?.user?._id }
      ]
    });
    
    if (!user) {
      throw new Error('Assignee not found.');
    }
    if (!user.is_active) {
      throw new Error('Assignee is not active.');
    }
  
    const project = await Project.findById(project_id); 
    if (!project) {
      throw new Error('Project not found.');
    }
  
    const isAssigneeInProject = await Project.exists({
      _id: project_id,
      users: assignees
    });
  
    if (!isAssigneeInProject) {
      throw new Error('Assignee is not part of the project.');
    }

    const isTaskInProject = await Project.exists({
      _id: project_id,
      tasks: _id
    });

    if (!isTaskInProject) {
      throw new Error('Task is not part of the project.');
    }
  
    if (!project.start_date || !project.end_date) {
      throw new Error('Project start_date or end_date is missing.');
    }
  
    if (startDate && (startDate < project.start_date || startDate > project.end_date)) {
      throw new Error('Task start_date must be within the project start_date and end_date.');
    }
  
    if (endDate && (endDate < project.start_date || endDate > project.end_date)) {
      throw new Error('Task end_date must be within the project start_date and end_date.');
    }
  
    if(type_id) {
      const type = await Type.findById(type_id);
      if (!type || type.is_hiding) {
        throw new Error('Type not found.');
      }
    }
    
    if (priority_id) {
      const priority = await Priority.findById(priority_id);
      if (!priority || priority.is_hiding) {
        throw new Error('Priority not found or is hidden.');
      }
    }

    const status = await Status.findById(status_id);
    if (!status || status.is_hiding) {
      throw new Error('Status not found.');
    }

    if (existingTask.assignees && existingTask.assignees !== assignees) {
      await User.findByIdAndUpdate(
        existingTask.assignees, 
        { $pull: { tasks: _id } }, 
        { new: true }
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(_id, {
      name,
      assignees,
      assigneeName: user.name,
      start_date,
      end_date,
      type: type_id, 
      status, 
      priority: priority_id 
    }, { new: true }).exec(); 

    await User.findByIdAndUpdate(
      assignees, 
      { $push: { tasks: _id } }, 
      { new: true }
    );

    const status_closed = await Status.findOne({ type: StatusType.Closed }).exec();

    const closedTasksCount = await Task.countDocuments({ project: project_id, status: status_closed?._id.toString() });

    const totalTasksCountDoc = await Project.findById(project_id).select('total_task').exec();

    if (!totalTasksCountDoc) {
      throw new Error('Project not found.');
    }

    const totalTasksCount = totalTasksCountDoc.total_task != null ? totalTasksCountDoc.total_task : 1;
    const process = closedTasksCount / totalTasksCount;

    await Project.findByIdAndUpdate(
      project_id,
      { process },
      { new: true }
    );

      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update task: ${(error as Error).message}`);
    }
};

const deleteTask = async (req: CustomRequest, taskId: string): Promise<boolean> => {
  try {
    const user_id = req.user?._id;
    const user_role = req.user?.role;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID format.');
    }

    const task = await Task.findById(taskId).exec();
    if (!task) {
      throw new Error('Task not found.');
    }
    console.log(user_id, task.assignees)

    if (user_role !== USER_ROLE.ADMIN && task?.assignees?.toString() !== user_id) {
      throw new Error('You can only delete your own tasks.');
    }

    const projectId = task.project
    const userId = task.assignees

    const result = await Task.deleteOne({ _id: taskId }).exec();

    if (result.deletedCount === 0) {
      throw new Error('Task not found.');
    }

    await Project.updateOne(
      { _id: projectId },
      { $pull: { tasks: taskId }, $inc: { total_task: -1 }  }
    ).exec();

    await User.updateOne(
      { _id: userId },
      { $pull: { tasks: taskId } }
    ).exec();
    const status_closed = await Status.findOne({ type: StatusType.Closed }).exec();

    const closedTasksCount = await Task.countDocuments({ project: projectId, status: status_closed?._id.toString() });

    const totalTasksCountDoc = await Project.findById(projectId).select('total_task').exec();

    if (!totalTasksCountDoc) {
      throw new Error('Project not found.');
    }

    const totalTasksCount = totalTasksCountDoc.total_task != null ? totalTasksCountDoc.total_task : 1;
    const process = closedTasksCount / totalTasksCount;

    await Project.findByIdAndUpdate(
      projectId,
      { process },
      { new: true }
    );

    return true;
  } catch (error) {
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
};

const listTasks = async (req: Request): Promise<ITaskListResponse> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; 
    const limit = parseInt(req.query.limit as string, 10) || 10; 

    const skip = (page - 1) * limit;
    
    const total = await Task.countDocuments().exec();

    const tasks = await Task.find()
      .populate('project','name slug start_date end_date total_task process')
      .populate('assignees','name email date_of_birth')
      .populate('type','type')
      .populate('status','type')
      .populate({
        path: 'priority',
        select: 'type position',
        options: { sort: { position: -1 } }, 
      })      
      .skip(skip)
      .limit(limit)
      .exec();

    return { tasks, total, limit, page };
  } catch (error) {
    throw new Error(`Failed to list tasks: ${(error as Error).message}`);
  }
};

const detailTask = async (taskId: string): Promise<ITask | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid project ID format.');
    }

    const project = await Task.findOne({_id: taskId }) 
      .select('-users.password') 
      .populate('assignees', 'name email') 
      .populate('type', 'type')
      .populate('status', 'type')
      .populate({
        path: 'priority',
        select: 'type position',
        options: { sort: { position: -1 } }, 
      })     
      .exec();
    if(!project) {
      throw new Error('Task not found')
    } else {
      return project;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve task: ${(error as Error).message}`);
  }
};

const getTasks = async (
  filter: { project_id?: string; user_id?: string }, 
  req: Request
): Promise<ITaskListResponse> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; 
    const limit = parseInt(req.query.limit as string, 10) || 10; 
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filter.project_id) {
      query.project = filter.project_id;
    }
    if (filter.user_id) {
      query.assignees = filter.user_id;
    }

    const total = await Task.countDocuments(query).exec();
    const tasks = await Task.find(query)
      .populate('project', 'name slug start_date end_date total_task process')
      .populate('assignees', 'name email date_of_birth')
      .populate('type', 'type')
      .populate('status', 'type')
      .populate({
        path: 'priority',
        select: 'type position',
        options: { sort: { position: -1 } }, 
      })           
      .skip(skip)
      .limit(limit)
      .exec();

    return { tasks, total, limit, page };
  } catch (error) {
    throw new Error(`Failed to list tasks: ${(error as Error).message}`);
  }
};


export default {
  createTask, editTask, deleteTask, listTasks, getTasks, detailTask
}