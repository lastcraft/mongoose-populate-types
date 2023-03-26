import mongoose from "mongoose";
import { Person } from "./models/person";
import { Account } from "./models/account";
import { Project } from "./models/project";

const clearAll = async (): Promise<void> => {
  return new Promise((resolve) => resolve());
};

const isPopulated = <T>(x: string | mongoose.Types.ObjectId | T): x is T =>
  !(x instanceof mongoose.Types.ObjectId) && typeof x !== "string";

const createPerson = async (name: string): Promise<Person> => {};

const createAccount = async (
  ownerId: mongoose.Types.ObjectId
): Promise<Account> => {};

const createProject = async (
  accountId: mongoose.Types.ObjectId
): Promise<Project> => {};

const getProject = async (
  ownerId: mongoose.Types.ObjectId
): PopulatedProject => {};

const showProject = (project: PopulatedProject): void => {};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const owner = await createPerson("Fred");
  const account = await createAccount(owner._id);
  const project = await createProject(account._id);
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
