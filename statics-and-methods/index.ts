import mongoose, { HydratedDocument } from "mongoose";
import { Enhanced, EnhancedModel } from "./models/enhanced-model";

const clearAll = async (): Promise<void> => {
  await EnhancedModel.deleteMany({});
};

const createEnhanced = async (
  contents: Enhanced
): Promise<HydratedDocument<Enhanced>> => {
  const career = new EnhancedModel(contents);
  await career.save();
  return career;
};

const findEnhanced = async (
  query: mongoose.FilterQuery<Enhanced>
): Promise<HydratedDocument<Enhanced>> => {
  const enhanced = await EnhancedModel.findOne(query);
  if (!enhanced) {
    throw new Error("Not found");
  }
  return enhanced;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  console.log(await createEnhanced({ name: "a1" }));
  const enhanced = (await findEnhanced({ name: "a1" }))!;
  console.log("Hydrated:", enhanced);
  console.log("JSON:", enhanced.toJSON());

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
