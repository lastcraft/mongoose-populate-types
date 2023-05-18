import mongoose from "mongoose";

export interface A {
  name: string;
  nickname?: string;
  bObject: { s: string; n?: number };
  cObject?: { s: string; n?: number };
  dObject?: { s: string; n?: number };
}

const aSchema = new mongoose.Schema<A>({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
  bObject: { s: String, n: { type: Number, required: false } },
  cObject: {
    type: { s: String, n: { type: Number, required: false, default: 88 } },
    required: false,
  },
  dObject: {
    type: new mongoose.Schema(
      {
        s: String,
        n: { type: Number, required: true, default: 99 },
      },
      { _id: false }
    ),
    required: false,
  },
});

export const AModel = mongoose.model<A>("A", aSchema);
