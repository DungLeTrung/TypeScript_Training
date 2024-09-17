import { model, Schema } from "mongoose";
import { IInvite } from "../interface/invite.interface";
import { IPriority } from "../interface/priority.interface";
import { REGEX } from "../utils/regex";

const inviteSchema = new Schema<IInvite> ({
  invite_id: { 
    type: String, 
    required: true, 
  },
  project: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  is_used: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
})

export const Invite = model<IInvite>('Invite', inviteSchema);
