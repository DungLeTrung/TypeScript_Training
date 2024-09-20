import mongoose from "mongoose";
import { ITask, ITaskListResponse } from "../../interface/task.interface";
import { Priority } from "../../models/priority.model";
import { Status } from "../../models/status.model";
import { Task } from "../../models/task.model";
import { Type } from "../../models/type.model";
import { User } from "../../models/user.model";
import { Project } from "../../models/project.model";

const createTask =  async (taskData: ITask): Promise<ITask> => {
  try {
    const { name, assignees, project: project_id, start_date, end_date, type: type_id, status: status_id = "66ecece2a53f61dc98c034a2", priority: priority_id } = taskData;
  
    const startDate = typeof taskData.start_date === 'string' ? new Date(taskData.start_date) : taskData.start_date;
    const endDate = typeof taskData.end_date === 'string' ? new Date(taskData.end_date) : taskData.end_date;
  
    if (startDate && endDate && startDate >= endDate) {
      throw new Error('start_date must be before end_date.');
    }
  
    if (!name || !type_id || !status_id || !priority_id) {
      throw new Error('Name, type, status, and priority are required.');
    }
  
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Name must be a non-empty string.');
    }
  
    const user = await User.findById(assignees);
    if (!user) {
      throw new Error('Assignee not found.');
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
  
    const type = await Type.findById(type_id);
    if (!type || type.is_hiding) {
      throw new Error('Type not found.');
    }
    const status = await Status.findById(status_id);
    if (!status || type.is_hiding) {
      throw new Error('Status not found.');
    }
    const priority = await Priority.findById(priority_id);
    if (!priority || type.is_hiding) {
      throw new Error('Priority not found.');
    }
  
      const newTask = new Task({
        name,
        assignees,
        project,
        start_date,
        end_date,
        type,
        status,
        priority
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
  
      return savedTask;
    } catch (error) {
      throw new Error(`Failed to create task: ${(error as Error).message}`);
    }
};

const editTask = async (_id: string, taskData: ITask): Promise<any> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error('Invalid task ID format.');
    }

    const existingTask = await Task.findById(_id);
    if(!existingTask) {
      throw new Error('Task is not exist.');
    }
  
    const { name, assignees, project: project_id, start_date, end_date, type: type_id, status: status_id, priority: priority_id } = taskData;
  
    const startDate = typeof start_date === 'string' ? new Date(start_date) : start_date;
    const endDate = typeof end_date === 'string' ? new Date(end_date) : end_date;
  
    if (startDate && endDate && startDate >= endDate) {
      throw new Error('start_date must be before end_date.');
    }
  
    if (!name || !type_id || !status_id || !priority_id) {
      throw new Error('Name, type, status, and priority are required.');
    }
  
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Name must be a non-empty string.');
    }
  
    const user = await User.findById(assignees);
    if (!user) {
      throw new Error('Assignee not found.');
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
  
    const type = await Type.findById(type_id);
    if (!type || type.is_hiding) {
      throw new Error('Type not found or is hidden.');
    }
  
    const status = await Status.findById(status_id);
    if (!status || status.is_hiding) {
      throw new Error('Status not found or is hidden.');
    }
  
    const priority = await Priority.findById(priority_id);
    if (!priority || priority.is_hiding) {
      throw new Error('Priority not found or is hidden.');
    }

    const updatedTask = await Task.findByIdAndUpdate(_id, {
      name,
      assignees,
      start_date,
      end_date,
      type, 
      status, 
      priority 
    }, { new: true }).exec(); 

    const closedTasksCount = await Task.countDocuments({ project: project_id, status: '66ecef859777454daa6924ea' });

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

const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID format.');
    }

    const task = await Task.findById(taskId).exec();
    if (!task) {
      throw new Error('Task not found.');
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


    return true;
  } catch (error) {
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
};

const listTasks = async (page: number, limit: number): Promise<ITaskListResponse> => {
  try {
    const skip = (page - 1) * limit;
    
    const total = await Task.countDocuments().exec();

    const tasks = await Task.find()
      .populate('project','name slug start_date end_date total_task process')
      .populate('assignees','name email date_of_birth')
      .populate('type','type')
      .populate('status','type')
      .populate('priority','type')
      .skip(skip)
      .limit(limit)
      .exec();

    return { tasks, total };
  } catch (error) {
    throw new Error(`Failed to list tasks: ${(error as Error).message}`);
  }
};

const getTasksByProjectId = async (project_id: string, page: number, limit: number): Promise<ITaskListResponse> => {
  try {
    const skip = (page - 1) * limit;
    
    const total = await Task.countDocuments({project: project_id}).exec();

    const tasks = await Task.find({project: project_id})
      .populate('project','name slug start_date end_date total_task process')
      .populate('assignees','name email date_of_birth')
      .populate('type','type')
      .populate('status','type')
      .populate('priority','type')
      .skip(skip)
      .limit(limit)
      .exec();

    return { tasks, total };
  } catch (error) {
    throw new Error(`Failed to list tasks: ${(error as Error).message}`);
  }
};


export default {
  createTask, editTask, deleteTask, listTasks, getTasksByProjectId
}