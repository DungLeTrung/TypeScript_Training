import mongoose from "mongoose";
import { IType, ITypeListResponse } from "../../interface/type.interface";
import { Type } from "../../models/type.model";
import { FeatureType } from "../../utils/const";

const createType = async (type: string, color: string ): Promise<IType> => {
  if (!type) {
    throw new Error('Type is required.');
  }

  const existingType = await Type.findOne({ type }).exec();
  if (existingType) {
    throw new Error('Task type already exists');
  }

  try {
    const newTaskType = new Type({ type, color, is_hiding: false });
    return await newTaskType.save();
  } catch (error) {
    throw new Error(`Failed to create type: ${(error as Error).message}`);
  }
};

const listTypes = async (page: number, limit: number): Promise<ITypeListResponse> => {
  try {
    const skip = (page - 1) * limit;

    const total = await Type.countDocuments({ is_hiding: false }).exec();

    const dbTaskTypes = await Type.find({is_hiding: false}).exec();
    const allTypes = [...dbTaskTypes];

    const paginatedStatuses = allTypes.slice(skip, skip + limit);
    
    const totalStatuses = total;

    return {types: paginatedStatuses, total: totalStatuses};
  } catch (error) {
    throw new Error(`Failed to list types: ${(error as Error).message}`);
  }
};

const editType = async (_id: string, typeData: IType): Promise<any> => {
  try {
    const bug = await Type.findOne({type: FeatureType.Bug}).exec();

    const feature = await Type.findOne({type: FeatureType.Feature}).exec();

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error('Invalid type ID format.');
    }

    const existingType = await Type.findOne({_id: _id, is_hiding: true}).exec();
    if(existingType) {
      throw new Error('Invalid type Id');
    }
  
    if (!typeData.type || typeof typeData.type !== 'string' || typeData.type.trim() === '') {
      throw new Error('Type is required and cannot be empty.');
    }
  
    const validatedColor = typeData.color && typeData.color.trim() !== '' ? typeData.color : undefined;
  
    const updateData: Partial<IType> = {
      ...typeData,
      color: validatedColor, 
    };

    if ((bug && bug._id.toString() === _id) || (feature && feature._id.toString() === _id)) {
      throw new Error('You can not edit classic type');
    }  

    const updatedType = await Type.findByIdAndUpdate(_id, updateData, { new: true }).exec();
    return updatedType;
  } catch (error) {
    throw new Error(`Failed to update type: ${(error as Error).message}`);
  }
}

const hidingType = async (typeId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(typeId)) {
      throw new Error('Invalid type ID format.');
    }

    const bug = await Type.findOne({type: FeatureType.Bug}).exec();

    const feature = await Type.findOne({type: FeatureType.Feature}).exec();
  
    if ((bug && bug._id.toString() === typeId) || (feature && feature._id.toString() === typeId)) {
      throw new Error('You can not hiding classic type');
    }  

    const type = await Type.findById(typeId).exec();
    if (!type) {
      throw new Error('Type not found.');
    }

    const updatedType = await Type.findByIdAndUpdate(
      typeId,
      { is_hiding: !type.is_hiding },
      { new: true } 
    ).exec();

    return updatedType !== null;
  } catch (error) {
    throw new Error(`Failed to hiding type`);
  }
};

const getTypeById = async (typeId: string): Promise<IType | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(typeId)) {
      throw new Error('Invalid type ID format.');
    }

    const priority = await Type.findOne({_id: typeId, is_hiding: false }) 
      .exec();
    if(!priority) {
      throw new Error('Type not found')
    } else {
      return priority;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve type: ${(error as Error).message}`);
  }
};

export default {
  createType, listTypes, editType, hidingType, getTypeById
}