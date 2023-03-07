import mongoose from "mongoose";

export interface Stuff {
  definitely: string;
  maybe: string;
}

const stuffSchema = new mongoose.Schema<Stuff>({
  definitely: { type: String, required: true },
  maybe: { type: String, required: true, default: "M" },
});

const StuffModel = mongoose.model<Stuff>("Child", stuffSchema);
// class StuffModel extends mongoose.model<Stuff>("Child", stuffSchema) {
//   static staticStuff = "";
// }

const clearAll = async (): Promise<void> => {
  await StuffModel.deleteMany({});
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  await new StuffModel({
    definitely: "D",
  }).save();

  const stuff = await StuffModel.findOne({ definitely: "D" });
  if (stuff) {
    console.log(stuff.schema.paths.maybe.options.default);
  }

  await mongoose.disconnect();
  return 0;
};

main()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    mongoose
      .disconnect()
      .then((result) => {
        console.log("disconnected:", result);
      })
      .catch(console.error);
  });
