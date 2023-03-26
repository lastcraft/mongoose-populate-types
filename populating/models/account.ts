import mongoose from "mongoose";

export interface Account {
  name: string;
}

const accountSchema = new mongoose.Schema<Account>({
  name: { type: String, required: true },
});

export const AccountModel = mongoose.model<Account>("Account", accountSchema);
