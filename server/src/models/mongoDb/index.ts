import { Blog, BlogData, BlogParams, User } from "../types";
import { Db, Document, MongoClient, ObjectId, WithId } from "mongodb";
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

let dbClient: MongoClient;
let database: Db;
const { IS_DEV, MONGODB_URI_DEV, IS_PROD, MONGODB_URI_PROD, MONGODB_URI } =
  CONFIG;

export enum DBNames {
  TALEPOD_DEV = "talepod_dev",
  TALEPOD_PROD = "talepod_prod",
}

export enum DBCollections {
  stories = "stories",
  stories_library = "stories_library",
  stories_library_backup = "stories_library_backup",
  users = "users",
  blogs = "blogs",
}

const getMongoDbUri = (): string => {
  if (IS_DEV && MONGODB_URI_DEV) {
    return MONGODB_URI_DEV;
  }

  if (IS_PROD && MONGODB_URI_PROD) {
    return MONGODB_URI_PROD;
  }

  return MONGODB_URI ?? "";
};

const getDatabaseName = (): string => {
  return IS_DEV ? DBNames.TALEPOD_DEV : DBNames.TALEPOD_PROD;
};

const databaseInit = async () => {
  const uri = getMongoDbUri();
  dbClient = new MongoClient(uri);

  try {
    await dbClient.connect();
    // // FOR DEVELOPMENT USE ONLY
    // await copyDocumentsFromDatabaseToAnotherDatabase();
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
    throw new Error("❌ Failed to get document to DB", { cause: error });
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
    await updateDocument(storyId, { seo: storySeo }, DBCollections.stories);
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

    await updateDocument(storyId, { audioFile }, DBCollections.stories);

    console.log("✅ File saved to DB successfully");
  } catch (error) {
    console.error("❌ Error saving file data to DB", error);
  }
};

const saveUserDataToDb = async (user: User): Promise<ObjectId | undefined> => {
  try {
    const newUserId = await createDocument(user, DBCollections.users);
    console.log("✅ User saved to DB successfully");
    return newUserId;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

const updateUserInDb = async (
  userId: string,
  updatedUserData: Partial<User>
): Promise<WithId<Document> | undefined> => {
  try {
    const updatedUser = await updateDocument(
      userId,
      updatedUserData,
      DBCollections.users
    );

    if (!updatedUser) throw new Error("User not found or update failed");

    console.log("✅ User updated in DB successfully!");

    return updatedUser;
  } catch (error) {
    throw new Error("❌ Error updating user data in DB", { cause: error });
  }
};

const saveBlogToDb = async (
  blog: Partial<Blog>
): Promise<ObjectId | undefined> => {
  try {
    console.log("🧮 Saving Blog to Database 🧮");
    const blogId: ObjectId = await createDocument(
      // blogData,
      blog,
      DBCollections.blogs
    );
    console.log("✅ Blog saved to DB successfully");

    return blogId;
  } catch (error) {
    throw new Error("❌ Error saving blog data to DB", { cause: error });
  }
};

// // // FOR DEVELOPMENT USE ONLY
// const copyDocumentsFromDatabaseToAnotherDatabase = async () => {
//   // Access the Dev and Prod databases
//   const devDb = dbClient.db(DBNames.TALEPOD_DEV);
//   const prodDb = dbClient.db(DBNames.TALEPOD_PROD);

//   // Collection names to copy
//   const collectionsToCopy = [DBCollections.blogs];

//   for (const collectionName of collectionsToCopy) {
//     // Fetch all documents from the Dev collection
//     const devCollection = devDb.collection(collectionName);
//     const devDocuments = await devCollection.find().toArray();

//     if (devDocuments.length > 0) {
//       // Insert documents into the Prod collection
//       const prodCollection = prodDb.collection(collectionName);

//       // Remove existing documents in the prod collection (to avoid duplicates)
//       await prodCollection.deleteMany({});

//       // Insert the documents from dev to prod
//       await prodCollection.insertMany(devDocuments);

//       console.log(
//         `Successfully copied ${devDocuments.length} documents from ${collectionName} in Dev to Prod`
//       );
//     } else {
//       console.log(`No documents found in ${collectionName} in Dev`);
//     }
//   }
// };

export {
  dbClient,
  database,
  databaseInit,
  getMongoDbUri,
  closeDatabase,
  getDocumentFromDb,
  getDocumentByFieldFromDb,
  saveStoryToDb,
  saveStorySeoToDb,
  saveFileDataToDb,
  saveUserDataToDb,
  updateUserInDb,
  saveBlogToDb,
};
