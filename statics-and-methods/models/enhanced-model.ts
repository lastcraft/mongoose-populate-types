import mongoose from "mongoose";

const allSalutations = { M: "Mr.", F: "Ms." };

interface EnhancedFields {
  name: string;
  sex: "M" | "F";
}

interface EnhancedMethods {
  formally(): string;
  title(): string;
}

// Cleanest interface I could manage
export type Enhanced = EnhancedFields & EnhancedMethods;

interface EnhancedType
  extends mongoose.Model<EnhancedFields, {}, EnhancedMethods> {
  salutations(): Record<string, string>;
}

const enhancedSchema = new mongoose.Schema<EnhancedFields>(
  {
    name: { type: String, required: true },
    sex: { type: String, required: true },
  },
  {
    methods: {
      title: function title(this: mongoose.HydratedDocument<Enhanced>): string {
        return EnhancedModel.salutations()[this.sex];
      },
      formally: function formally(
        this: mongoose.HydratedDocument<Enhanced>
      ): string {
        return this.title() + " " + this.name;
      },
    },
  }
);

// enhancedSchema.method("title", function title(): string {
//   return EnhancedModel.salutations()[this.sex];
// });
//
// enhancedSchema.method("formally", function formally() {
//   return this.title() + " " + this.name;
// });

enhancedSchema.static("salutations", function salutations() {
  return allSalutations;
});

export const EnhancedModel = mongoose.model<EnhancedFields, EnhancedType>(
  "Enhanced",
  enhancedSchema
);
