import mongoose, { HydratedDocument } from "mongoose";
import { PersonInterface, PersonModel } from "./models/person";
import { AccountInterface, AccountModel } from "./models/account";
import { Project, ProjectInterface, ProjectModel } from "./models/project";

const clearAll = async (): Promise<void> => {
  await ProjectModel.deleteMany({});
  await AccountModel.deleteMany({});
  await PersonModel.deleteMany({});
};

const createPerson = async (
  name: string
): Promise<HydratedDocument<PersonInterface>> => {
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
): Promise<HydratedDocument<AccountInterface>> => {
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
): Promise<Project> => {
  await new ProjectModel({ name, account: accountId }).save();
  const project = await ProjectModel.findOne({ name });
  if (!project) {
    throw new Error("New Project not found");
  }
  return project;
};

const createProjectWithAccount = async (
  name: string,
  account: AccountInterface
): Promise<Project> => {
  const project = await new ProjectModel({ name, account: account }).save();
  return project;
};

const getProject = async (
  accountId: mongoose.Types.ObjectId
): Promise<Project<"account" | "team">> => {
  const project = await ProjectModel.findOne({ account: accountId });
  if (!project) {
    throw new Error("Project not found");
  }
  return project.populate<Project<"account" | "team">>("account team");
};

const showProject = (project: Project<"account" | "team">): void => {
  console.log("Project name:", project.name);
  console.log("Account", project.account);
  console.log("Team...");
  project.team.map((x) => console.log(x));
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const owner = await createPerson("Fred");
  const account = await createAccount("Acme", owner._id);
  const project = await createProject("Big idea", account._id);
  const member = await createPerson("Jane");
  project.team.push(member._id);
  await project.save();

  showProject(await getProject(project.account));

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
