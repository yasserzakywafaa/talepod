import { Db, MongoClient, ObjectId } from "mongodb";
import { ProfileInfo, Story, StoryData, StoryParams, StorySeo } from "../types";
import { createDocument, updateDocument } from "./crudOperations";

import CONFIG from "../../config";

let dbClient: MongoClient;
let database: Db;

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
  // return DBNames.TALEPOD_PROD;
};

const databaseInit = async () => {
  const uri = getMongoDbUri();
  dbClient = new MongoClient(uri);

  try {
    await dbClient.connect();
    const dbName = getDatabaseName();
    database = dbClient.db(dbName);

    console.info("✅ Connected to MongoDB Atlas", { dbName });

    await createCollections();
    await createIndexes();
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
      console.info(`✅ Collection '${collectionName}' created`);
    } else {
      console.info(`-- ℹ️  Collection '${collectionName}' already exists`);
    }
  }
};

const createIndexes = async () => {
  try {
    const storiesCollection = database.collection(DBCollections.Stories);
    // Create compound index for these fields
    await storiesCollection.createIndex({ slug: 1, createdAt: -1 });
    console.info(
      "-- ℹ️  Compound index created on 'slug' and 'createdAt' fields"
    );

    // Text index for name search
    await storiesCollection.createIndex({ name: "text" });
    console.info("-- ℹ️  Compound index created on 'name' field");

    // Compound index on frequently queried combinations
    await storiesCollection.createIndex({ gender: 1, language: 1, age: 1 });
    console.info(
      "-- ℹ️  Compound index created on 'gender', 'language' and 'age' fields"
    );
    await storiesCollection.createIndex({ environment: 1, moral: -1, tone: 1 });
    console.info(
      "-- ℹ️  Compound index created on 'environment', 'moral' and 'tone' fields"
    );
  } catch (error) {
    console.error("❌ Error creating index:", error);
  }
};

const closeDatabase = async () => {
  if (dbClient) {
    await dbClient.close();
    console.info("✅ Database connection closed");
  }
};

const saveStoryToDb = async (
  story: Partial<Story>,
  profileInfo: ProfileInfo,
  storyParams: StoryParams
): Promise<ObjectId | undefined> => {
  try {
    const storyData: StoryData = {
      ...story,
      profileInfo,
      storyParams,
    };
    const storyId: ObjectId = await createDocument(
      storyData,
      DBCollections.Stories
    );
    console.log("✅ Story saved to DB successfully");

    return storyId;
  } catch (error) {
    throw new Error("❌ Error saving story data to DB", { cause: error });
  }
};

const saveStorySeoToDb = async (
  storyId: string,
  storeSeo: StorySeo
): Promise<void> => {
  try {
    await updateDocument(storyId, DBCollections.Stories, { seo: storeSeo });
    console.log("✅ Story SEO saved to DB successfully");
  } catch (error) {
    throw new Error("❌ Error saving story SEO to DB", { cause: error });
  }
};

const saveFileDataToDb = async (
  storyId: string,
  audioFileName: string,
  audioFileS3Uri: string
): Promise<void> => {
  try {
    const audioFile = {
      fileName: audioFileName,
      url: audioFileS3Uri,
      createdAt: new Date(),
    };

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
  saveStorySeoToDb,
  saveFileDataToDb,
};
