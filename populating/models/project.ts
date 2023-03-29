import mongoose, { HydratedDocument } from "mongoose";
import { Person } from "./person";
import { Account } from "./account";

export interface Project {
  name: string;
  account: mongoose.Types.ObjectId;
  team: Array<mongoose.Types.ObjectId>;
}

interface PopulatableProject {
  account: Account;
  team: mongoose.Types.DocumentArray<Person>;
}

type Populated<T, PopulatableT, Fields extends keyof PopulatableT> = Omit<
  HydratedDocument<T>,
  Fields
> & {
  [key in Fields]: PopulatableT[key];
};

export type PopulatedProject<Fields extends keyof PopulatableProject> =
  Populated<Project, PopulatableProject, Fields>;

export type WithAccount<T> = Omit<T, "account"> & {
  account: Account;
};

export type WithTeam<T> = Omit<T, "team"> & {
  team: mongoose.Types.DocumentArray<Person>;
};

const projectSchema = new mongoose.Schema<Project>({
  name: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

export const ProjectModel = mongoose.model<Project>("Project", projectSchema);
