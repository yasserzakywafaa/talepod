import { DBCollectionsEnum, mongoDatabase } from ".";
import { Document, Filter, ObjectId } from "mongodb";

// Generic CRUD now delegates to the shared createMongoDatabase (server-core).
// These thin adapters preserve TalePod's existing call signatures — collection
// name last, string ids converted to ObjectId, and the default createdAt sort on
// query reads — so the domain helpers and call sites stay unchanged.

// Create a new document
export const createDocument = async (
  data: any,
  collectionName: DBCollectionsEnum
) => mongoDatabase.createDocument<Document>(collectionName, data);

// Read a document by ID
export const readDocument = async (
  documentId: any,
  collectionName: DBCollectionsEnum
) => mongoDatabase.readDocument<Document>(collectionName, documentId);

// Read a document by Field
export const readDocumentByField = async (
  field: string,
  value: string,
  collectionName: DBCollectionsEnum
) =>
  mongoDatabase.readDocumentByQuery<Document>(collectionName, {
    [field]: value,
  } as Filter<Document>);

// Read a document by query
export const readDocumentByQuery = async (
  query: Record<string, any>,
  collectionName: DBCollectionsEnum
) => {
  try {
    return await mongoDatabase.readDocumentByQuery<Document>(
      collectionName,
      query as Filter<Document>,
      { sort: { createdAt: -1 } }
    );
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
    const results = await mongoDatabase.updateDocument<Document>(
      collectionName,
      new ObjectId(documentId),
      fieldsToUpdate as Partial<Document>
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
  try {
    const result = await mongoDatabase.deleteDocument<Document>(
      collectionName,
      new ObjectId(documentId)
    );
    console.log("✅ Document deleted successfully.");

    return result;
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
    return await mongoDatabase.createBulkDocuments<Document>(
      collectionName,
      documents
    );
  } catch (error) {
    throw new Error("❌ Error saving blogs in bulk:", { cause: error });
  }
};
