import mongoose from "mongoose";

export interface A {
  name: string;
  nickname?: string;
}

const aSchema = new mongoose.Schema<A>({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
});

export const AModel = mongoose.model<A>("A", aSchema);
