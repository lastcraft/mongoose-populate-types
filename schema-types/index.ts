import mongoose, { HydratedDocument } from "mongoose";
import { A, AModel } from "./models/a-model";

const clearAll = async (): Promise<void> => {
  await AModel.deleteMany({});
};

const createA = async (contents: A): Promise<HydratedDocument<A>> => {
  const career = new AModel(contents);
  await career.save();
  return career;
};

const findA = async (
  query: mongoose.FilterQuery<A>
): Promise<HydratedDocument<A>> => {
  const a = await AModel.findOne(query);
  if (!a) {
    throw new Error("Not found");
  }
  return a;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  console.log(await createA({ name: "aaa", bObject: { s: "bbb", n: 1 } }));
  const a = await findA({ name: "aaa" });
  if (a) {
    console.log(a);
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
