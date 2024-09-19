import mongoose from "mongoose";
import { IType } from "../../interface/type.interface";
import { Type } from "../../models/type.model";
import { IPriority, IPriorityListResponse } from "../../interface/priority.interface";
import { Priority } from "../../models/priority.model";

const createPriority = async (type: string, position: number ): Promise<IPriority> => {
  if (!type) {
    throw new Error('Priority is required.');
  }

  if(position && position <= 0) { 
    throw new Error('Position must be greater than 0.');
  }

  const existingType = await Priority.findOne({ type }).exec();
  if (existingType) {
    throw new Error('Priority already exists');
  }

  const existingPosition = await Priority.findOne({ position }).exec();
  if (existingPosition) {
    throw new Error('Position already exists');
  }

  try {
    const newPriority = new Priority({ type, position, is_hiding: false });
    return await newPriority.save();
  } catch (err) {
    throw new Error('Failed to create priority!!!');
  }
};

const listPriorities = async (page: number, limit: number): Promise<IPriorityListResponse> => {
  try {
    const skip = (page - 1) * limit;

    const total = await Priority.countDocuments({ is_hiding: false }).exec();

    const priorities = await Priority.find({ is_hiding: false })
      .skip(skip) 
      .limit(limit) 
      .sort({ position: 1 }) 
      .exec();

      return { priorities, total };
  } catch (error) {
    throw new Error(`Failed to list priorities!!!`);
  }
};

const editPriority = async (_id: string, typeData: IPriority): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid priority ID format.');
  }

  if (!typeData.type || typeof typeData.type !== 'string' || typeData.type.trim() === '') {
    throw new Error('Type is required and cannot be empty.');
  }

  const type = typeData.type;

  const existingType = await Priority.findOne({ type }).exec();
  if (existingType) {
    throw new Error('Priority already exists');
  }

  if(typeData.position && typeData.position <= 0) { 
    throw new Error('Position must be greater than 0.');
  }

  const validatedPosition = typeData.position && typeData.position !== null ? typeData.position : undefined;

  const updateData: Partial<IPriority> = {
    ...typeData,
    position: validatedPosition, 
  };

  try {
    const updatedType = await Priority.findByIdAndUpdate(_id, updateData, { new: true }).exec();
    return updatedType;
  } catch (error) {
    throw new Error(`Failed to update Priority`);
  }
}

const hidingPriority = async (priorityId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(priorityId)) {
    throw new Error('Invalid Priority ID format.');
  }

  try {
    const type = await Priority.findById(priorityId).exec();
    if (!type) {
      throw new Error('Priority not found.');
    }

    const updatedType = await Priority.findByIdAndUpdate(
      priorityId,
      { is_hiding: !type.is_hiding },
      { new: true } 
    ).exec();

    return updatedType !== null;
  } catch (error) {
    throw new Error(`Failed to hiding priority`);
  }
};

export default {
  createPriority, listPriorities, editPriority, hidingPriority
}