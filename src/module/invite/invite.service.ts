import { IInvite } from "../../interface/invite.interface";
import { Invite } from "../../models/invite.model";
import { v4 as uuidv4 } from 'uuid';
import { Project } from "../../models/project.model";
import mongoose from "mongoose";

const createInvite = async (project_id: string): Promise<IInvite> => {
  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    throw new Error('Invalid priority ID format.');
  }

  const projectExist = await Project.findById(project_id);
  if(!projectExist){
    throw new Error("Project not found")
  }

  try {
    const inviteId = uuidv4();

    const newInvite = new Invite
    ({
      invite_id: inviteId,
      project: project_id,
      is_used: false, 
    });

    const savedInvite = await newInvite.save();
    return savedInvite;
  } catch (error) {
    throw new Error('Failed to create invite.');
  }
};

export default {
  createInvite
}