import mongoose from "mongoose";

export interface Project {
  name: string;
  accountId: mongoose.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<Project>({
  name: { type: String, required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

export const ProjectModel = mongoose.model<Project>("Project", projectSchema);
