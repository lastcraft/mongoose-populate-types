import mongoose, { HydratedDocument } from "mongoose";
import { Person, PersonModel } from "./models/person";
import { Account, AccountModel } from "./models/account";
import { PopulatedProject, Project, ProjectModel } from "./models/project";

const clearAll = async (): Promise<void> => {
  return new Promise((resolve) => resolve());
};

const isPopulated = <T>(x: string | mongoose.Types.ObjectId | T): x is T =>
  !(x instanceof mongoose.Types.ObjectId) && typeof x !== "string";

const createPerson = async (
  name: string
): Promise<HydratedDocument<Person>> => {
  await new PersonModel({ name }).save();
  const person = await PersonModel.findOne({ name });
  if (!person) {
    throw new Error("New Person not found");
  }
  return person;
};

const createAccount = async (
  name: string,
  ownerId: mongoose.Types.ObjectId
): Promise<HydratedDocument<Account>> => {
  await new AccountModel({ name, owner: ownerId }).save();
  const account = await AccountModel.findOne({ name });
  if (!account) {
    throw Error("New Account not found");
  }
  return account;
};

const createProject = async (
  name: string,
  accountId: mongoose.Types.ObjectId
): Promise<HydratedDocument<Project>> => {
  await new ProjectModel({ name, account: accountId }).save();
  const project = await ProjectModel.findOne({ name });
  if (!project) {
    throw new Error("New Project not found");
  }
  return project;
};

const getProject = async (
  ownerId: mongoose.Types.ObjectId
): Promise<PopulatedProject> => {
  const project = await ProjectModel.findOne({ owner: ownerId });
  if (!project) {
    throw new Error("New Project not found");
  }
  return await project.populate<PopulatedProject>("account");
};

const showProject = (project: PopulatedProject): void => {
  console.log(project.name);
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const owner = await createPerson("Fred");
  const account = await createAccount("Acme", owner._id);
  const project = await createProject("Big idea", account._id);
  const member = await createPerson("Jane");

  showProject(await getProject(project._id));

  await mongoose.disconnect();
  return 0;
};

main()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    mongoose
      .disconnect()
      .then((result) => {
        console.log("disconnected:", result);
      })
      .catch(console.error);
  });
