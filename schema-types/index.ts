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

  console.log(await createA({ name: "a1", bObject: { s: "b1", n: 1 } }));
  const a1 = await findA({ name: "a1" });
  if (a1) {
    console.log(a1);
  }

  console.log(await createA({ name: "a2", bObject: { s: "b2" } }));
  const a2 = await findA({ name: "a2" });
  if (a2) {
    console.log(a2);
  }

  console.log(
    await createA({ name: "a3", bObject: { s: "b3" }, cObject: { s: "c3" } })
  );
  const a3 = await findA({ name: "a3" });
  if (a3) {
    console.log(a3);
    console.log(a3.cObject?.s);
  }

  console.log(
    await createA({ name: "a4", bObject: { s: "b4" }, dObject: { s: "d4" } })
  );
  const a4 = await findA({ name: "a4" });
  if (a4) {
    console.log(a4);
    console.log(a4.dObject?.s);
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
