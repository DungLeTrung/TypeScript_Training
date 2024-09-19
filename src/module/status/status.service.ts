import mongoose from "mongoose";
import { IType } from "../../interface/type.interface";
import { Type } from "../../models/type.model";
import { IStatus, IStatusListResponse } from "../../interface/status.interface";
import { Status } from "../../models/status.model";



const createStatus = async (type: string, position: number ): Promise<IStatus> => {
  if (!type) {
    throw new Error('Status is required.');
  }
  
  if(position && position <= 0) { 
    throw new Error('Position must be greater than 0.');
  }

  const existingStatus = await Status.findOne({ type }).exec();
  if (existingStatus) {
    throw new Error('Status already exists');
  }

  const existingPosition = await Status.findOne({ position }).exec();
  if (existingPosition) {
    throw new Error('Position of status already exists');
  }

  try {
    const newStatus = new Status({ type, position, is_hiding: false });
    return await newStatus.save();
  } catch (err) {
    throw new Error('Failed to create status!!!');
  }
};

const listStatuses = async (page: number, limit: number): Promise<IStatusListResponse> => {
  try {
    const skip = (page - 1) * limit;

    const dbStatuses = await Status.find({ is_hiding: false })
      .sort({ position: 1 })
      .exec();

    const total = await Status.countDocuments({ is_hiding: false }).exec();

    const lastStatus = await Status.findOne({ is_hiding: false })
      .sort({ position: -1 })
      .exec();

    const closePosition = lastStatus ? lastStatus.position + 1 : 1;

    const defaultStatuses: IStatus[] = [
      { type: 'Close', position: closePosition, is_hiding: false },
      { type: 'New', position: 1, is_hiding: false },
    ];

    const allStatuses = [...defaultStatuses, ...dbStatuses];
    
    allStatuses.sort((a, b) => a.position - b.position);

    const paginatedStatuses = allStatuses.slice(skip, skip + limit);

    const totalWithDefaults = total + defaultStatuses.length;

    return { statuses: paginatedStatuses, total: totalWithDefaults };
  } catch (err) {
    throw new Error('Failed to list statuses!!!');
  }
};

const editStatus = async (_id: string, typeData: IStatus): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid status ID format.');
  }

  if (!typeData.type || typeof typeData.type !== 'string' || typeData.type.trim() === '') {
    throw new Error('Type is required and cannot be empty.');
  }

  if(typeData.position && typeData.position <= 0) { 
    throw new Error('Position must be greater than 0.');
  }


  const validatedPosition = typeData.position && typeData.position !== null ? typeData.position : undefined;

  const updateData: Partial<IStatus> = {
    ...typeData,
    position: validatedPosition, 
  };

  try {
    const updatedStatus = await Status.findByIdAndUpdate(_id, updateData, { new: true }).exec();
    return updatedStatus;
  } catch (error) {
    throw new Error(`Failed to update status`);
  }
}

const hidingStatus = async (statusId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(statusId)) {
    throw new Error('Invalid status ID format.');
  }

  const type = await Status.findById(statusId).exec();
  if (!type) {
    throw new Error('Status not found.');
  }

  try {
    const updatedType = await Status.findByIdAndUpdate(
      statusId,
      { is_hiding: !type.is_hiding },
      { new: true } 
    ).exec();

    return updatedType !== null;
  } catch (error) {
    throw new Error(`Failed to hiding status`);
  }
};

export default {
  createStatus, listStatuses, editStatus, hidingStatus
}