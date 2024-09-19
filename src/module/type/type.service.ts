import mongoose from "mongoose";
import { IType, ITypeListResponse } from "../../interface/type.interface";
import { Type } from "../../models/type.model";

const defaultTypes = [
  { type: 'Bug', color: '#FF0000', is_hiding: false },
  { type: 'Feature', color: '#00CC00', is_hiding: false }
];

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
  } catch (err) {
    throw new Error('Failed to create type!!!');
  }
};

const listTypes = async (page: number, limit: number): Promise<ITypeListResponse> => {
  try {
    const skip = (page - 1) * limit;

    const total = await Type.countDocuments({ is_hiding: false }).exec();

    const dbTaskTypes = await Type.find({is_hiding: false}).exec();
    const allTypes = [...defaultTypes, ...dbTaskTypes];

    const paginatedStatuses = allTypes.slice(skip, skip + limit);
    
    const totalStatuses = total + defaultTypes.length;

    return {types: paginatedStatuses, total: totalStatuses};
  } catch (err) {
    throw new Error('Failed to list types!!!');
  }
};

const editType = async (_id: string, typeData: IType): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid type ID format.');
  }

  if (!typeData.type || typeof typeData.type !== 'string' || typeData.type.trim() === '') {
    throw new Error('Type is required and cannot be empty.');
  }

  const validatedColor = typeData.color && typeData.color.trim() !== '' ? typeData.color : undefined;

  const updateData: Partial<IType> = {
    ...typeData,
    color: validatedColor, 
  };

  try {
    const updatedType = await Type.findByIdAndUpdate(_id, updateData, { new: true }).exec();
    return updatedType;
  } catch (error) {
    throw new Error(`Failed to update type`);
  }
}

const hidingType = async (typeId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(typeId)) {
    throw new Error('Invalid type ID format.');
  }

  try {
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

export default {
  createType, listTypes, editType, hidingType
}