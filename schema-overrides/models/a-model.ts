import mongoose, { HydratedDocument } from "mongoose";

export interface A {
  name: string;
  nickname?: string;
  anObject: { s: string; n?: number };
}

const aSchema = new mongoose.Schema<A>({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
  anObject: { s: String, n: { type: Number, required: false } },
});

aSchema.set("toJSON", {
  transform: (
    before: HydratedDocument<A>,
    after: Record<string, string | number | object | boolean>
  ) => {
    after.transformed = true;
  },
});

export const AModel = mongoose.model<A>("A", aSchema);
