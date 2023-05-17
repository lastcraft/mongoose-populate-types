import mongoose from "mongoose";

export interface Career {
  name: string;
  type: "C";
}

const careerSchema = new mongoose.Schema<Career>({
  name: { type: String, required: true },
});

export const CareerModel = mongoose.model<Career>("Career", careerSchema);

export interface Fireman extends Career {
  temperature: number;
  type: "F";
}

const firemanSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
});

export const FiremanModel = CareerModel.discriminator<Fireman>(
  "Fireman",
  firemanSchema
);

export interface Teacher extends Career {
  books: number;
  type: "T";
}

const teacherSchema = new mongoose.Schema({
  books: { type: Number, required: true },
});

export const TeacherModel = CareerModel.discriminator<Teacher>(
  "Teacher",
  teacherSchema
);
