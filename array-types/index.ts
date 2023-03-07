import mongoose, { HydratedDocument } from "mongoose";
import { Child, ChildModel } from "./models/child";
import { Parent, ParentModel } from "./models/parent";

const clearAll = async (): Promise<void> => {
  await ChildModel.deleteMany({});
  await ParentModel.deleteMany({});
};

const isPopulated = <T>(x: string | mongoose.Types.ObjectId | T): x is T =>
  !(x instanceof mongoose.Types.ObjectId) && typeof x !== "string";

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

const findChildByName = async (
  name: string
): Promise<HydratedDocument<Child>> => {
  const child = await ChildModel.findOne({ name: name });
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

const createParentFromChildIds = async (
  name: string,
  childIds: Array<mongoose.Types.ObjectId>
): Promise<HydratedDocument<Parent>> => {
  const parent = new ParentModel({ name, children: childIds });
  await parent.save();
  return parent;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const echoToby = await createChild("Toby");
  console.log("Person saved", echoToby);

  const toby = await findChildByName("Toby");
  console.log("Person found", toby);

  const echoMarcus = await createParent("Marcus", [toby]);
  console.log("Parent saved with children", echoMarcus);

  const echoAviva = await createParentFromChildIds("Aviva", [toby._id]);
  console.log("Aviva saved with children", echoAviva);

  const marcus = await ParentModel.findOne({ name: "Marcus" });
  console.log("Parent found", marcus);
  if (marcus) {
    console.log("Parent's unpopulated child", marcus.children[0]);
    const childId = marcus.children[0];
    await marcus.populate("children");
    console.log("Parent populated", marcus);

    let foundMarcusChild: mongoose.Types.ObjectId | HydratedDocument<Child> =
      marcus.children[0];
    if (!isPopulated(foundMarcusChild)) {
      console.log("Not populated", marcus.children[0]);
      foundMarcusChild = await findChildByName("Toby");
      console.log();
    }
    if (isPopulated(foundMarcusChild)) {
      console.log("Now populated");
      foundMarcusChild.name = "Tobias";
    }
    const result = await (await findChild({ _id: childId })).save();
    console.log("Child populated and then searched for was saved", result);
  }

  const bryn = await createChild("Bryn");
  console.log("Saving a new child", await bryn.save());
  const marcus2 = await ParentModel.findOne({ name: "Marcus" });
  if (marcus2) {
    marcus2.children.push(bryn._id);
    await marcus2.save();
    console.log("Saved with child added by ID", marcus2);
  }
  const marcus3 = await ParentModel.findOne({ name: "Marcus" });
  if (marcus3) {
    await marcus3.populate("children");
    console.log("Parent populated with added child ID", marcus3);
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
