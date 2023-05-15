import mongoose, { HydratedDocument } from "mongoose";
import { PersonInterface } from "./person";
import { AccountInterface } from "./account";
import { OptionallyPopulated } from "./optionally-populated";

export interface ProjectInterface {
  name: string;
  account: mongoose.Types.ObjectId;
  team: Array<mongoose.Types.ObjectId>;
}

interface PopulatableProject {
  account: HydratedDocument<AccountInterface>;
  team: Array<HydratedDocument<PersonInterface>>;
}

export type Project<Fields extends keyof PopulatableProject = never> =
  OptionallyPopulated<ProjectInterface, PopulatableProject, Fields>;

const projectSchema = new mongoose.Schema<ProjectInterface>({
  name: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

export const ProjectModel = mongoose.model<ProjectInterface>(
  "Project",
  projectSchema
);
