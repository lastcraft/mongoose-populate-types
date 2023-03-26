import mongoose from "mongoose";

export interface Account {
  name: string;
  ownerId: mongoose.Types.ObjectId;
}

const accountSchema = new mongoose.Schema<Account>({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
});

export const AccountModel = mongoose.model<Account>("Account", accountSchema);
