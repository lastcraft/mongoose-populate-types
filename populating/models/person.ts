import mongoose from "mongoose";

export interface Person {
  name: string;
}

const personSchema = new mongoose.Schema<Person>({
  name: { type: String, required: true },
});

export const PersonModel = mongoose.model<Person>("Person", personSchema);
