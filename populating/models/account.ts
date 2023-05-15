import mongoose from "mongoose";

export interface AccountInterface {
  name: string;
  owner: mongoose.Types.ObjectId;
}

const accountSchema = new mongoose.Schema<AccountInterface>({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
});

export const AccountModel = mongoose.model<AccountInterface>(
  "Account",
  accountSchema
);
