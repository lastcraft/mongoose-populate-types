import mongoose from "mongoose";

export interface A {
  name: string;
}

const aSchema = new mongoose.Schema<A>({
  name: { type: String, required: true },
});

export const AModel = mongoose.model<A>("A", aSchema);
