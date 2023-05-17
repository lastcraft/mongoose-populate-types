import mongoose from "mongoose";

export interface Career {
  name: string;
}

const careerSchema = new mongoose.Schema<Career>({
  name: { type: String, required: true },
});

export const CareerModel = mongoose.model<Career>("Career", careerSchema);
