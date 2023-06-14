import mongoose from "mongoose";

interface EnhancedFields {
  name: string;
  sex: "M" | "F";
}

interface EnhancedMethods {
  nickname(): string;
}

export type Enhanced = EnhancedFields & EnhancedMethods;

type EnhancedType = mongoose.Model<EnhancedFields, {}, EnhancedMethods>;

const enhancedSchema = new mongoose.Schema<EnhancedFields>({
  name: { type: String, required: true },
  sex: { type: String, required: true },
});

enhancedSchema.method("nickname", function nickname() {
  return this.sex === "M" ? "Mr. " + this.name : "Ms. " + this.name;
});

export const EnhancedModel = mongoose.model<EnhancedFields, EnhancedType>(
  "Enhanced",
  enhancedSchema
);
