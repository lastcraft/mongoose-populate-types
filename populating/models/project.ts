import mongoose from "mongoose";

export interface Project {
  name: string;
}

const projectSchema = new mongoose.Schema<Project>({
  name: { type: String, required: true },
});

export const ProjectModel = mongoose.model<Project>("Project", projectSchema);
