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

  console.log(await createA({ name: "a1", anObject: { s: "b1", n: 1 } }));
  const a1 = (await findA({ name: "a1" }))!;
  console.log("Hydrated:", a1);
  console.log("JSON:", a1.toJSON());

  console.log(await createA({ name: "a2", anObject: { s: "b2" } }));
  const a2 = (await findA({ name: "a2" }))!;
  console.log("Hydrated:", a2);
  console.log("JSON:", a2.toJSON());
  const a2j: A = a2.toJSON();
  console.log("A:", a2j);

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
