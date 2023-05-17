import mongoose, { HydratedDocument } from "mongoose";
import {
  CareerModel,
  Career,
  FiremanModel,
  TeacherModel,
  Fireman,
  Teacher,
} from "./models/career";

const clearAll = async (): Promise<void> => {
  await CareerModel.deleteMany({});
};

const createCareer = async (
  name: string
): Promise<HydratedDocument<Career>> => {
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

const createFireman = async (
  name: string,
  temperature: number
): Promise<HydratedDocument<Fireman>> => {
  const career = new FiremanModel({
    name,
    temperature,
  });
  await career.save();
  return career;
};

const findFireman = async (
  query: mongoose.FilterQuery<Fireman>
): Promise<HydratedDocument<Fireman>> => {
  const child = await FiremanModel.findOne(query);
  if (!child) {
    throw new Error("Not found");
  }
  return child;
};

const createTeacher = async (
  name: string,
  books: number
): Promise<HydratedDocument<Teacher>> => {
  const career = new TeacherModel({
    name,
    books,
  });
  await career.save();
  return career;
};

const findTeacher = async (
  query: mongoose.FilterQuery<Teacher>
): Promise<HydratedDocument<Teacher>> => {
  const child = await TeacherModel.findOne(query);
  if (!child) {
    throw new Error("Not found");
  }
  return child;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  console.log(await createFireman("fred", 451));
  console.log(await createTeacher("tess", 1));
  const fred = await findCareer({ name: "fred" });
  if (fred && fred.type == "F") {
    console.log(fred);
    console.log(fred.temperature);
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
