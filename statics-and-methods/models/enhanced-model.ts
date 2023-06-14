import mongoose from "mongoose";

const salutations = { M: "Mr.", F: "Ms." };

interface EnhancedFields {
  name: string;
  sex: "M" | "F";
}

interface EnhancedMethods {
  formally(): string;
}

export type Enhanced = EnhancedFields & EnhancedMethods;

type EnhancedType = mongoose.Model<EnhancedFields, {}, EnhancedMethods>;

const enhancedSchema = new mongoose.Schema<EnhancedFields>({
  name: { type: String, required: true },
  sex: { type: String, required: true },
});

enhancedSchema.method("formally", function formally() {
  return salutations[this.sex] + " " + this.name;
});

export const EnhancedModel = mongoose.model<EnhancedFields, EnhancedType>(
  "Enhanced",
  enhancedSchema
);
