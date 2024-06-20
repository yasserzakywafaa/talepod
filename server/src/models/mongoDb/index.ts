import { MongoClient, ObjectId } from "mongodb";
import { createDocument, updateDocument } from "./crudOperations";

import CONFIG from "../../config";
import { Story } from "../types";

let dbClient: MongoClient;
let database: any;

export enum DBNames {
  TALEPOD_DEV = "talepod_dev",
  TALEPOD_PROD = "talepod_prod",
}

export enum DBCollections {
  Stories = "Stories",
  Users = "Users",
}

const getMongoDbUri = (): string => {
  switch (true) {
    // case CONFIG.IS_DEV:
    //   return CONFIG.MONGODB_URI;

    // case CONFIG.IS_PROD:
    //   // Uncomment when going to production
    //   // return CONFIG.MONGODB_URI_PROD;
    //   return CONFIG.MONGODB_URI_DEV;

    default:
      return CONFIG.MONGODB_URI;
  }
};

const getDatabaseName = (): string => {
  return CONFIG.IS_DEV ? DBNames.TALEPOD_DEV : DBNames.TALEPOD_PROD;
};

const databaseInit = async () => {
  const uri = getMongoDbUri();
  dbClient = new MongoClient(uri);

  try {
    await dbClient.connect();
    const dbName = getDatabaseName();
    database = dbClient.db(dbName);

    console.info("✅ Connected to MongoDB Atlas", { dbName });

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
