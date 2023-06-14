import mongoose from "mongoose";

export interface Enhanced {
  name: string;
  nickname?: string;
}

const enhancedSchema = new mongoose.Schema<Enhanced>({
  name: { type: String, required: true },
});

export const EnhancedModel = mongoose.model<Enhanced>(
  "Enhanced",
  enhancedSchema
);
