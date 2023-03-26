import mongoose, { HydratedDocument } from "mongoose";
import { Person, PersonModel } from "./models/person";
import { Account, AccountModel } from "./models/account";
import { Project, ProjectModel } from "./models/project";

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
  await new AccountModel({ name, ownerId }).save();
  const account = await AccountModel.findOne({ name });
  if (!account) {
    throw Error("New Account not found");
  }
  return account;
};

const createProject = async (
  name: string,
  accountId: mongoose.Types.ObjectId
): Promise<HydratedDocument<Project> | null> => {
  await new ProjectModel({ name, accountId }).save();
  const project = await ProjectModel.findOne({ name });
  if (!project) {
    throw new Error("New Project not found");
  }
  return project;
};

const getProject = async (
  ownerId: mongoose.Types.ObjectId
): PopulatedProject => {};

const showProject = (project: PopulatedProject): void => {};

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
