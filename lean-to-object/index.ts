import mongoose, { HydratedDocument, LeanDocument } from "mongoose";
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

const findObjectChild = async (
  query: mongoose.FilterQuery<Child>
): Promise<Child & { _id: mongoose.Types.ObjectId }> => {
  const child = await ChildModel.findOne(query).lean().exec();
  if (!child) {
    throw new Error("Not found");
  }
  return child;
};

const findLeanChild = async (
  query: mongoose.FilterQuery<Child>
): Promise<LeanDocument<HydratedDocument<Child>>> => {
  const child = await ChildModel.findOne(query).lean().exec();
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

  const child = await createChild("Bryn");
  console.log("Type:", child.constructor.name);
  console.log("Model:", child);
  console.log("Object:", child.toObject());
  console.log("Object ID:", child.toObject()._id);
  console.log("Object ID string:", child.toObject()._id.toString());
  child.age = 18;
  await child.save();

  await createChild("Toby");
  const leanChild = await findLeanChild({ name: "Toby" });
  if (leanChild) {
    console.log("Type:", leanChild.constructor.name);
    console.log("Lean:", leanChild);
  }
  const objectChild = await findLeanChild({ name: "Toby" });
  if (objectChild) {
    console.log("Type:", objectChild.constructor.name);
    console.log("Object:", objectChild);
  }

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
