import { DBCollectionsEnum, database } from ".";

import { ObjectId } from "mongodb";

// Create a new document
export const createDocument = async (
  data: any,
  collectionName: DBCollectionsEnum
) => {
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(data);

  return result.insertedId;
};

// Read a document by ID
export const readDocument = async (
  documentId: any,
  collectionName: DBCollectionsEnum
) => {
  const collection = database.collection(collectionName);
  const document = await collection.findOne({ _id: documentId });

  return document;
};

// Read a document by Field
export const readDocumentByField = async (
  field: string,
  value: string,
  collectionName: DBCollectionsEnum
) => {
  const collection = database.collection(collectionName);
  const document = await collection.findOne({ [field]: value });

  return document;
};

// Read a document by query
export const readDocumentByQuery = async (
  query: Record<string, any>,
  collectionName: DBCollectionsEnum
) => {
  try {
    const documents = database.collection(collectionName);
    const document = await documents.findOne(query, {
      sort: { createdAt: -1 },
    });

    return document;
  } catch (error) {
    throw new Error("❌ Failed to get document by query!", { cause: error });
  }
};

// Update a document by ID
export const updateDocument = async <T>(
  documentId: string,
  fieldsToUpdate: Partial<T>,
  collectionName: DBCollectionsEnum
) => {
  console.log("🧮 Updating Document in Database 🧮");
  try {
    const documents = database.collection(collectionName);
    const results = await documents.findOneAndUpdate(
      { _id: new ObjectId(documentId) },
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
  documentId: string,
  collectionName: DBCollectionsEnum
) => {
  const collection = database.collection(collectionName);
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(documentId),
    });
    console.log("✅ Document deleted successfully.");

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error("❌ Failed to delete document!", { cause: error });
  }
};

// Create new bulk documents
export const createBulkDocuments = async (
  documents: any[],
  collectionName: DBCollectionsEnum
) => {
  try {
    const collection = database.collection(collectionName);
    const results = await collection.insertMany(documents);

    return results;
  } catch (error) {
    throw new Error("❌ Error saving blogs in bulk:", { cause: error });
  }
};
