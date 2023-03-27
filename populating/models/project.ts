import mongoose, { HydratedDocument } from "mongoose";
import { Person } from "./person";
import { Account } from "./account";

export interface Project {
  name: string;
  account: mongoose.Types.ObjectId;
  team: Array<mongoose.Types.ObjectId>;
}

export type PopulatedProject = HydratedDocument<Project> & {
  account: Account;
  team: mongoose.Types.DocumentArray<Person>;
};

const projectSchema = new mongoose.Schema<Project>({
  name: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

export const ProjectModel = mongoose.model<Project>("Project", projectSchema);
