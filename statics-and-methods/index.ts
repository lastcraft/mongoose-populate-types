import mongoose, { HydratedDocument } from "mongoose";
import { Enhanced, EnhancedModel } from "./models/enhanced-model";

type NonFunctionKeyNames<T> = Exclude<
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [key in keyof T]: T[key] extends Function ? never : key;
  }[keyof T],
  undefined
>;

type JustFields<T> = Pick<T, NonFunctionKeyNames<T>>;

const clearAll = async (): Promise<void> => {
  await EnhancedModel.deleteMany({});
};

const createEnhanced = async (
  contents: JustFields<Enhanced>
): Promise<HydratedDocument<Enhanced>> => {
  const enhanced = new EnhancedModel(contents);
  await enhanced.save();
  return enhanced;
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

  console.log("Salutations: ", EnhancedModel.salutations());

  console.log(await createEnhanced({ name: "fred", sex: "M" }));
  const enhanced = (await findEnhanced({ name: "fred" }))!;
  console.log("Fred:", enhanced);
  console.log("nickname():", enhanced.formally());

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
