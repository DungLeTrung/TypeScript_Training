import mongoose from "mongoose";
import { IType } from "../../interface/type.interface";
import { Type } from "../../models/type.model";
import { IStatus, IStatusListResponse } from "../../interface/status.interface";
import { Status } from "../../models/status.model";



const createStatus = async (type: string, position: number ): Promise<IStatus> => {
  try {
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

    const existingStatusClosed = await Status.findOne({ type: 'Closed' }).exec();
    if (!existingStatusClosed) {
      throw new Error('Status Closed not found.'); 
    }
    
    if (position >= existingStatusClosed.position) {
      throw new Error('Position must be smaller than the position of Closed status.');
    }
    const existingPosition = await Status.findOne({ position }).exec();
    if (existingPosition) {
      throw new Error('Position of status already exists');
    }

    const newStatus = new Status({ type, position, is_hiding: false });
    return await newStatus.save();
  } catch (err) {
    throw new Error(`Failed to create status: ${(err as Error).message}`);
  }
};

const listStatuses = async (page: number, limit: number): Promise<IStatusListResponse> => {
  try {
    const skip = (page - 1) * limit;

    const total = await Status.countDocuments({ is_hiding: false }).exec();

    const statuses = await Status.find({ is_hiding: false })
      .skip(skip)
      .limit(limit)
      .sort({ position: 1 })
      .exec();

    return { statuses, total };
  } catch (err) {
    throw new Error('Failed to list statuses!!!');
  }
};

const editStatus = async (_id: string, typeData: IStatus): Promise<any> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error('Invalid status ID format.');
    }
  
    if (!typeData.type || typeof typeData.type !== 'string' || typeData.type.trim() === '') {
      throw new Error('Type is required and cannot be empty.');
    }

    const type = typeData.type;
  
    const existingType = await Status.findOne({ type }).exec();
    if (existingType) {
      throw new Error('Status already exists');
    }
  
    if(typeData.position && typeData.position <= 0) { 
      throw new Error('Position must be greater than 0.');
    }

    if(_id === "66ecece2a53f61dc98c034a2" || _id === "66ecef859777454daa6924ea") {
      throw new Error('You can not edit classic status');
    }

    const existingStatusClosed = await Status.findOne({ _id: _id }).exec();
    if (!existingStatusClosed) {
      throw new Error('Status Closed not found.'); 
    }
    
    if (typeData.position >= existingStatusClosed.position) {
      throw new Error('Position must be smaller than the position of Closed status.');
    }
  
    const validatedPosition = typeData.position && typeData.position !== null ? typeData.position : undefined;
  
    const updateData: Partial<IStatus> = {
      ...typeData,
      position: validatedPosition, 
    };

    const updatedStatus = await Status.findByIdAndUpdate(_id, updateData, { new: true }).exec();
    return updatedStatus;
  } catch (error) {
    throw new Error(`Failed to update status: ${(error as Error).message}`);
  }
}

const hidingStatus = async (statusId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(statusId)) {
      throw new Error('Invalid status ID format.');
    }
  
    if(statusId === "66ecece2a53f61dc98c034a2" || statusId === "66ecef859777454daa6924ea") {
      throw new Error('You can not hiding classic status');
    }
  
    const type = await Status.findById(statusId).exec();
    if (!type) {
      throw new Error('Status not found.');
    }
  
    const updatedType = await Status.findByIdAndUpdate(
      statusId,
      { is_hiding: !type.is_hiding },
      { new: true } 
    ).exec();

    return updatedType !== null;
  } catch (error) {
    throw new Error(`Failed to hiding status: ${(error as Error).message}`);
  }
};

const getStatusById = async (statusId: string): Promise<IStatus | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(statusId)) {
      throw new Error('Invalid status ID format.');
    }

    const priority = await Status.findOne({_id: statusId, is_hiding: false }) 
      .exec();
    if(!priority) {
      throw new Error('Status not found')
    } else {
      return priority;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve status: ${(error as Error).message}`);
  }
};

export default {
  createStatus, listStatuses, editStatus, hidingStatus, getStatusById
}