import mongoose, { HydratedDocument } from "mongoose";
import { Child, ChildModel } from "./models/child";
import { Parent, ParentModel } from "./models/parent";

const clearAll = async (): Promise<void> => {
  await ChildModel.deleteMany({});
  await ParentModel.deleteMany({});
};

const createChild = async (name: string): Promise<HydratedDocument<Child>> => {
  const child = new ChildModel({
    name: name,
  });
  await child.save();
  return child;
};

const findChild = async (
  query: mongoose.FilterQuery<Child>
): Promise<HydratedDocument<Child>> => {
  const child = await ChildModel.findOne(query);
  if (!child) {
    throw new Error("Not found");
  }
  return child;
};

const createParent = async (
  name: string,
  children: Array<HydratedDocument<Child>>
): Promise<HydratedDocument<Parent>> => {
  const parent = new ParentModel({ name, children });
  await parent.save();
  return parent;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

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
