import mongoose from "mongoose";

export interface A {
  name: string;
  nickname?: string;
  bObject: { s: string; n: number };
}

const aSchema = new mongoose.Schema<A>({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
  bObject: { s: String, n: Number },
});

export const AModel = mongoose.model<A>("A", aSchema);
