import { MongoClient, ObjectId } from "mongodb";
import { createDocument, updateDocument } from "./crudOperations";

// import AudioFile from "./schema/audioFile";
import CONFIG from "../../config";
import { Story } from "../types";

let dbClient: MongoClient;
let database: any;

export enum DBCollections {
  Stories = "Stories",
  Users = "Users",
}

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

const databaseInit = async () => {
  const uri = getMongoDbUri();
  dbClient = new MongoClient(uri);

  try {
    await dbClient.connect();
    database = dbClient.db(`${CONFIG.MONGODB_DEV_CLUSTER}`);

    console.info("✅ Connected to MongoDB Atlas");

    // Create necessary collections
    await createCollections();
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas", error);
  }
};

const createCollections = async () => {
  const collections = Object.keys(DBCollections);

  for (const collectionName of collections) {
    const collection = await database
      .listCollections({ name: collectionName })
      .toArray();
    if (collection.length === 0) {
      await database.createCollection(collectionName);
      console.info(`-- ✅ Collection '${collectionName}' created`);
    } else {
      console.info(`-- ℹ️  Collection '${collectionName}' already exists`);
    }
  }
};

const closeDatabase = async () => {
  if (dbClient) {
    await dbClient.close();
    console.info("✅ Database connection closed");
  }
};

const saveStoryToDb = async (
  story: Partial<Story>
): Promise<ObjectId | string> => {
  try {
    const storyId: ObjectId = await createDocument(
      story as Story,
      DBCollections.Stories
    );
    console.log("✅ Story saved to DB successfully");

    return storyId;
  } catch (error) {
    console.error("❌ Error saving story data to DB", error);

    return "";
  }
};

const saveFileDataToDb = async (
  storyId: string,
  audioFileName: string,
  audioFileS3Uri: string
): Promise<void> => {
  try {
    const collection = database.collection(DBCollections.Stories);
    const audioFile = {
      fileName: audioFileName,
      url: audioFileS3Uri,
      createdAt: new Date(),
    };

    // await collection.insertOne(audioFile);
    await updateDocument(storyId, DBCollections.Stories, { audioFile });

    console.log("✅ File saved to DB successfully");
  } catch (error) {
    console.error("❌ Error saving file data to DB", error);
  }
};

export {
  dbClient,
  database,
  databaseInit,
  closeDatabase,
  saveStoryToDb,
  saveFileDataToDb,
};
