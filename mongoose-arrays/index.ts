import mongoose, { HydratedDocument } from "mongoose";
import { Child, ChildModel } from "./models/child";
import { Parent, ParentModel, PopulatedParent } from "./models/parent";

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

const createParentFromChildIds = async (
  name: string,
  childIds: Array<mongoose.Types.ObjectId>,
  fosterChildIds: Array<mongoose.Types.ObjectId>
): Promise<HydratedDocument<Parent>> => {
  const parent = new ParentModel({
    name,
    children: childIds,
    fosterChildren: fosterChildIds,
  });
  await parent.save();
  return parent;
};

const findParent = async (
  name: string
): Promise<HydratedDocument<PopulatedParent> | null> => {
  return ParentModel.findOne({ name }).populate("children fosterChildren");
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const children = [
    (await createChild("Albert"))._id,
    (await createChild("Bethany"))._id,
  ];
  const fosterChildren = [
    (await createChild("Charlie"))._id,
    (await createChild("Davina"))._id,
  ];

  const createdParent = await createParentFromChildIds(
    "Mum",
    children,
    fosterChildren
  );
  const childId = (await createChild("William"))._id;
  createdParent.children.push(childId);
  await createdParent.save();

  console.log("createdParent >>>", createdParent);

  const foundParent = await findParent("Mum");
  if (foundParent) {
    console.log("foundParent >>>", foundParent);
  } else {
    throw new Error("Ouch");
  }

  const child = await createChild("Xyla");
  const fosterChildId = (await createChild("Yusef"))._id;
  const fosterChild = await createChild("Zebedee");

  foundParent.children.push(child);
  foundParent.fosterChildren.push(fosterChildId);
  foundParent.fosterChildren.push(fosterChild);
  await foundParent.save();
  console.log("foundParent after save >>>", foundParent);

  const foundParent2 = await findParent("Mum");
  if (foundParent) {
    console.log("foundParent2 >>>", foundParent2);
  } else {
    throw new Error("Ouch");
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
