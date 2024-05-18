import CONFIG from "../../config";
import mongoose from "mongoose";

const getMongoDbUri = (): string => {
  switch (true) {
    case CONFIG.IS_DEV:
      return CONFIG.MONGODB_URI_DEV;

    case CONFIG.IS_PROD:
      // Uncomment when going to production
      // return CONFIG.MONGODB_URI_PROD;
      return CONFIG.MONGODB_URI_DEV;

    default:
      return "";
  }
};

const databaseInit = () => {
  // mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connect(getMongoDbUri());

  const database = mongoose.connection;
  database.on("error", console.error.bind(console, "<<< Connection Error:>>>"));
  database.once("open", () => {
    console.info("<<< Connected to MongoDB Atlas >>>");

    console.log("Connected to MongoDB Atlas");
  });
};

export { databaseInit };
