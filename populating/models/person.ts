import mongoose from "mongoose";

export interface PersonInterface {
  name: string;
}

const personSchema = new mongoose.Schema<PersonInterface>({
  name: { type: String, required: true },
});

export const PersonModel = mongoose.model<PersonInterface>(
  "Person",
  personSchema
);
