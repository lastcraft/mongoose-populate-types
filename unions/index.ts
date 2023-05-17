import mongoose, { HydratedDocument } from "mongoose";
import { CareerModel, Career } from "./models/career";

const clearAll = async (): Promise<void> => {
  await CareerModel.deleteMany({});
};

const createChild = async (name: string): Promise<HydratedDocument<Career>> => {
  const career = new CareerModel({
    name: name,
  });
  await career.save();
  return career;
};

const findCareer = async (
  query: mongoose.FilterQuery<Career>
): Promise<HydratedDocument<Career>> => {
  const child = await CareerModel.findOne(query);
  if (!child) {
    throw new Error("Not found");
  }
  return child;
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
