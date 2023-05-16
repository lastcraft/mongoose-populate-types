import mongoose from "mongoose";

export interface Child {
  name: string;
  age?: number;
}

const childSchema = new mongoose.Schema<Child>({
  name: { type: String, required: true },
  age: { type: Number, required: false },
});

export const ChildModel = mongoose.model<Child>("Child", childSchema);
