import { HydratedDocument } from "mongoose";

export type OptionallyPopulated<
  UnhydratedT,
  PopulatedFieldsOfT,
  Fields extends keyof PopulatedFieldsOfT
> = Omit<HydratedDocument<UnhydratedT>, Fields> & {
  [key in Fields]: PopulatedFieldsOfT[key];
};
