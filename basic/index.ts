import mongoose, { HydratedDocument } from "mongoose";
import { ChildModel, Child } from "./models/child";
import { Parent, ParentModel } from "./models/parent";

const clearAll = async (): Promise<void> => {
  await ChildModel.deleteMany({});
  await ParentModel.deleteMany({});
};

const isPopulated = <T>(x: string | mongoose.Types.ObjectId | T): x is T =>
  !(x instanceof mongoose.Types.ObjectId) && typeof x !== "string";

const createChild = async (name: string): Promise<HydratedDocument<Child>> => {
  const child = new ChildModel({ name });
  await child.save();
  return child;
};

const findChild = async (name: string): Promise<HydratedDocument<Child>> => {
  const child = await ChildModel.findOne({ name });
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
  const parent = new ParentModel({ name, childIds });
  await parent.save();
  return parent;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://db:27017/playpen?directConnection=true");
  console.log("Connected");
  await clearAll();

  const child = await createChild("Toby");
  console.log("Person saved", child);

  const foundChild = await findChild("Toby");
  console.log("Person found", foundChild);

  const marcus = await createParent("Marcus", [child]);
  console.log("Parent saved with children", marcus);

  const aviva = await createParent("Aviva", [child]);
  console.log("Aviva saved with children", aviva);

  const foundMarcus = await ParentModel.findOne({ name: "Marcus" });
  console.log("Parent found", foundMarcus);
  if (foundMarcus) {
    console.log("Parent's child", foundMarcus.children[0]);
    await foundMarcus.populate("children");
    console.log("Parent populated", foundMarcus);
    let foundMarcusChild = foundMarcus.children[0];
    if (!isPopulated(foundMarcusChild)) {
      foundMarcusChild = await findChild("Toby");
    }
    foundMarcusChild.name = "Tobias";
    await foundMarcusChild.save();
  }

  const foundMarcus2 = await ParentModel.findOne({ name: "Marcus" });
  const child2 = await createChild("Bryn");
  await child2.save();
  if (foundMarcus2) {
    foundMarcus2.children.push(child2._id);
    await foundMarcus2.save();
  }

  const foundMarcus3 = await ParentModel.findOne({ name: "Marcus" });
  console.log("With children", foundMarcus3);
  if (foundMarcus3) {
    await foundMarcus3.populate("children");
    console.log("Populated with children", foundMarcus3);
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
