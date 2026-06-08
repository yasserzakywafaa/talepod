import { AggregationResult, BaseFilters, Blog, User } from "../types";
import {
  Collection,
  Db,
  DeleteResult,
  Document,
  Filter,
  InsertManyResult,
  MongoClient,
  ObjectId,
  Sort,
  WithId,
} from "mongodb";
import {
  ProfileInfo,
  Story,
  StoryData,
  StoryParams,
  StorySeo,
} from "../types/story";
import {
  createBulkDocuments,
  createDocument,
  readDocument,
  readDocumentByField,
  readDocumentByQuery,
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

export enum DBCollectionsEnum {
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
  const collections = Object.keys(DBCollectionsEnum);

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
    DBCollectionsEnum.stories,
    DBCollectionsEnum.stories_library,
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
      await stories.createIndex({
        isPremium: 1,
        "storyParams.createdByAdmin": 1,
        createdAt: -1,
      });
    }

    const users = database.collection(DBCollectionsEnum.users);
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
const getDocumentFromDb = async (
  docId: any,
  collectionName: DBCollectionsEnum
) => {
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
  collectionName: DBCollectionsEnum
) => {
  try {
    const document = await readDocumentByField(field, value, collectionName);

    return document;
  } catch (error) {
    throw new Error("❌ Failed to get document to DB", { cause: error });
  }
};

const getDocumentByQueryFromDb = async (
  query: Record<string, any>,
  collectionName: DBCollectionsEnum
) => {
  try {
    const document = await readDocumentByQuery(query, collectionName);

    return document;
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByQueryFromDb = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum
): Promise<WithId<T>[]> => {
  try {
    const collection: Collection<T> = database.collection<T>(collectionName);
    const documents = await collection.find(query).toArray();

    return documents;
  } catch (error) {
    console.error(
      `❌ Error fetching documents from ${collectionName} with query ${JSON.stringify(
        query
      )}:`,
      error
    );
    // Re-throw the error so the calling function's catch block can handle it
    throw new Error(
      `❌ Failed to fetch documents by query from ${collectionName}`
    );
  }
};

export const deleteDocumentByQuery = async (
  query: Filter<Document>,
  collectionName: DBCollectionsEnum | string
): Promise<DeleteResult> => {
  if (!query || Object.keys(query).length === 0) {
    throw new Error("❌ Deletion query cannot be empty.");
  }

  // Optional: Add extra logging for debugging (consider sensitive data in queries)
  console.log(
    `Attempting deleteOne in collection "${collectionName}" with query:`,
    JSON.stringify(query)
  );

  try {
    if (!database) {
      throw new Error(
        "❌ Database is not initialized. Call databaseInit() first."
      );
    }
    const collection: Collection = database.collection(collectionName);
    const result: DeleteResult = await collection.deleteOne(query);

    if (result.deletedCount === 1) {
      console.log(
        `✅ Successfully deleted 1 document from "${collectionName}" matching query.`
      );
    } else {
      console.log(
        `ℹ️ No document found in "${collectionName}" matching query for deletion.`
      );
    }

    return result; // Contains { acknowledged: boolean, deletedCount: number }
  } catch (error) {
    console.error(
      `❌ Database error during deleteOne in "${collectionName}" with query ${JSON.stringify(
        query
      )}:`,
      error
    );
    // Re-throw the error to be handled by the calling controller
    throw new Error(
      `Failed to delete document from ${collectionName}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
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
      DBCollectionsEnum.stories
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
    await updateDocument(storyId, { seo: storySeo }, DBCollectionsEnum.stories);
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

    await updateDocument(storyId, { audioFile }, DBCollectionsEnum.stories);

    console.log("✅ File saved to DB successfully");
  } catch (error) {
    console.error("❌ Error saving file data to DB", error);
  }
};

const saveUserDataToDb = async (user: User): Promise<ObjectId | undefined> => {
  try {
    const newUserId = await createDocument(user, DBCollectionsEnum.users);
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
      DBCollectionsEnum.users
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
      DBCollectionsEnum.blogs
    );
    console.log("✅ Blog saved to DB successfully");

    return blogId;
  } catch (error) {
    throw new Error("❌ Error saving blog data to DB", { cause: error });
  }
};

const saveBulkBlogToDb = async (
  blogs: Blog[]
): Promise<InsertManyResult<Document>> => {
  try {
    console.log("🧮 Saving Blog in Bulk to Database 🧮");
    const documents: InsertManyResult<Document> = await createBulkDocuments(
      blogs,
      DBCollectionsEnum.blogs
    );
    console.log("✅ Blogs saved in Bulk to DB successfully");

    return documents;
  } catch (error) {
    throw new Error("❌ Error saving blogs in bulk to DB", { cause: error });
  }
};

// Pagination utility function using MongoDB aggregation pipeline
const getPaginatedDocuments = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
  paginationParams: BaseFilters,
  options?: {
    customPipelineStages?: Record<string, any>[];
    sort?: Sort;
  }
): Promise<AggregationResult<T>> => {
  try {
    const { pageNumber, pageSize } = paginationParams;
    const collection: Collection<T> = database.collection<T>(collectionName);

    // Create sort object - use custom sort if provided, otherwise default to createdAt: -1
    const sort: Sort = options?.sort || { createdAt: -1 };
    const pipeline: Record<string, any>[] = [];
    pipeline.push({ $sort: sort });

    // Add custom pipeline stages before match if provided
    if (options?.customPipelineStages) {
      pipeline.push(...options.customPipelineStages);
    }

    // Match stage
    pipeline.push({ $match: query });

    // Facet stage to get both data and count in one query
    pipeline.push({
      $facet: {
        metadata: [
          { $count: "totalCount" },
          { $addFields: { pageNumber, pageSize } },
        ],
        results: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const aggregatedDocs = await collection.aggregate(pipeline).toArray();
    const { metadata, results } = aggregatedDocs[0] as AggregationResult<T>;
    const totalCount = metadata[0] ? metadata[0].totalCount : 0;
    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    return {
      metadata,
      results,
      paging: {
        pageNumber,
        pageSize,
        totalCount,
        totalPagesCount,
      },
    };
  } catch (error) {
    console.error(
      `❌ Error fetching paginated documents from ${collectionName}:`,
      error
    );
    throw error;
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
  getDocumentByQueryFromDb,
  getPaginatedDocuments,
  saveStoryToDb,
  saveStorySeoToDb,
  saveFileDataToDb,
  saveUserDataToDb,
  updateUserInDb,
  saveBlogToDb,
  saveBulkBlogToDb,
};
