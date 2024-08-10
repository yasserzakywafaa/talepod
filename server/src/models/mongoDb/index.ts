import { Db, MongoClient, ObjectId, WithId } from "mongodb";
import {
  ProfileInfo,
  Story,
  StoryData,
  StoryParams,
  StorySeo,
} from "../types/story";
import {
  createDocument,
  readDocument,
  readDocumentByField,
  updateDocument,
} from "./crudOperations";

import CONFIG from "../../config";
import { User } from "../types";

let dbClient: MongoClient;
let database: Db;

export enum DBNames {
  TALEPOD_DEV = "talepod_dev",
  TALEPOD_PROD = "talepod_prod",
}

export enum DBCollections {
  stories = "stories",
  stories_library = "stories_library",
  stories_library_backup = "stories_library_backup",
  users = "users",
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
  const collectionsToSearch = [
    DBCollections.stories,
    DBCollections.stories_library,
  ];

  try {
    for (const collection of collectionsToSearch) {
      const stories = database.collection(collection);
      // // stories.dropIndexes();
      // Ensure single-field indexes for individual fields
      await stories.createIndex({ _id: 1 });
      await stories.createIndex({ createdAt: -1 });
      await stories.createIndex({ slug: 1 });
      await stories.createIndex({ audio: 1 });
      await stories.createIndex({ "profileInfo.age": 1 });
      await stories.createIndex({ "profileInfo.name": 1 });
      await stories.createIndex({ "profileInfo.gender": 1 });
      await stories.createIndex({ "profileInfo.language.value": 1 });
      await stories.createIndex({ "storyParams.tone.value": 1 });
      await stories.createIndex({ "storyParams.moral.value": 1 });
      await stories.createIndex({ "storyParams.createdByAdmin": 1 });
      await stories.createIndex({ "storyParams.environment.value": 1 });
    }

    const users = database.collection(DBCollections.users);
    await users.createIndex({ _id: 1 });
    await users.createIndex({ userId: 1 });
    await users.createIndex({ email: 1 });
    await users.createIndex({ createdAt: 1 });
    await users.createIndex({ picture: 1 });
    await users.createIndex({ "name.givenName": 1 });
    await users.createIndex({ "name.familyName": 1 });
    await users.createIndex({ storyCount: 1 });
    await users.createIndex({ stories: 1 });
    await users.createIndex({ status: 1 });
    await users.createIndex({ role: 1 });
    await users.createIndex({ isPaidUser: 1 });

    // console.info(
    //   `-- ℹ️  Indexes created collections:>>>  ${collectionsToSearch.flatMap(
    //     (c) => c
    //   )}`
    // );
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

// // Data Handling
const getDocumentFromDb = async (docId: any, collectionName: DBCollections) => {
  try {
    const document = await readDocument(docId, collectionName);

    return document;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

const getDocumentByFieldFromDb = async (
  field: string,
  value: string,
  collectionName: DBCollections
) => {
  try {
    const document = await readDocumentByField(field, value, collectionName);

    return document;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
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
      DBCollections.stories
      // DBCollections.stories_library
    );
    console.log("✅ Story saved to DB successfully");

    return storyId;
  } catch (error) {
    throw new Error("❌ Error saving story data to DB", { cause: error });
  }
};

const saveStorySeoToDb = async (
  storyId: string,
  storySeo: StorySeo
): Promise<void> => {
  try {
    await updateDocument(storyId, { seo: storySeo });
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

    await updateDocument(storyId, { audioFile });

    console.log("✅ File saved to DB successfully");
  } catch (error) {
    console.error("❌ Error saving file data to DB", error);
  }
};

const saveUserDataToDb = async (userInfo: User): Promise<void> => {
  try {
    await createDocument(userInfo, DBCollections.users);
    console.log("✅ User saved to DB successfully");
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

// // FOR DEVELOPMENT USE ONLY
// const copyDocumentsFromDbCollectionToAnotherDbCollection = async () => {
//   const sourceDb = dbClient.db(DBNames.TALEPOD_DEV);
//   const targetDb = dbClient.db(DBNames.TALEPOD_DEV);
//   const sourceCollection = sourceDb.collection(DBCollections.stories_library);
//   const targetCollection = targetDb.collection(
//     DBCollections.stories_library_backup
//   );

//   let lastId = null;
//   let totalCopied = 0;

//   while (true) {
//     const query = lastId ? { _id: { $gt: lastId } } : {}; // Continue from the last processed document
//     const cursor = sourceCollection.find(query);

//     const batch = await cursor.toArray();
//     if (batch.length === 0) {
//       break; // Exit the loop if no more documents to process
//     }

//     await targetCollection.insertMany(batch);
//     totalCopied += batch.length;

//     lastId = batch[batch.length - 1]._id; // Keep track of the last processed document
//     console.log(`Copied ${totalCopied} documents so far...`);
//   }
// };

export {
  dbClient,
  database,
  databaseInit,
  closeDatabase,
  getDocumentFromDb,
  getDocumentByFieldFromDb,
  saveStoryToDb,
  saveStorySeoToDb,
  saveFileDataToDb,
  saveUserDataToDb,
};
