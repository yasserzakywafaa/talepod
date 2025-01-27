import { DBCollections, database } from ".";

import { ObjectId } from "mongodb";

// Create a new document
export const createDocument = async (
  data: any,
  collectionName: DBCollections
) => {
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(data);

  return result.insertedId;
};

// Read a document by ID
export const readDocument = async (
  docId: any,
  collectionName: DBCollections
) => {
  const documents = database.collection(collectionName);
  const document = await documents.findOne({ _id: docId });

  return document;
};

// Read a document by ID
export const readDocumentByField = async (
  field: string,
  value: string,
  collectionName: DBCollections
) => {
  const documents = database.collection(collectionName);
  const document = await documents.findOne({ [field]: value });

  return document;
};

// Update a document by ID
export const updateDocument = async <T>(
  docId: string,
  fieldsToUpdate: Partial<T>,
  collectionName: DBCollections
) => {
  console.log("🧮 Updating Document in Database 🧮");
  try {
    const documents = database.collection(collectionName);
    const results = await documents.findOneAndUpdate(
      { _id: new ObjectId(docId) },
      { $set: fieldsToUpdate },
      { returnDocument: "after" }
    );
    console.log(`✅ Document updated in collection: ${collectionName}.`);

    return results;
  } catch (error) {
    console.error(`❌ Error updating document:`, error);
    throw new Error("❌ Failed to update document!", { cause: error });
  }
};

// Delete a document by ID
export const deleteDocument = async (
  storyId: string,
  collectionName: DBCollections
) => {
  const stories = database.collection(collectionName);
  try {
    const result = await stories.deleteOne({ _id: new ObjectId(storyId) });
    console.log("✅ Document deleted successfully.");

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error("❌ Failed to delete document!", { cause: error });
  }
};
