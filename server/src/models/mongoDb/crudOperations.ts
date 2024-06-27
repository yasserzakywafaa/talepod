import { DBCollections, database } from ".";
import { Story, StoryData } from "../types";

import { ObjectId } from "mongodb";

// Create a new document
export const createDocument = async (
  data: StoryData,
  collectionName: DBCollections
) => {
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(data);

  return result.insertedId;
};

// Read a document by ID
export const getDocumentById = async (
  storyId: string,
  collectionName: DBCollections
) => {
  const stories = database.collection(collectionName);
  const story = await stories.findOne({ _id: new ObjectId(storyId) });

  return story;
};

// Update a document by ID
export const updateDocument = async (
  storyId: string,
  collectionName: DBCollections,
  fieldsToUpdate: Partial<Story>
) => {
  const stories = database.collection(collectionName);

  console.log("ℹ️  updateDocument:>>>", {
    storyId,
    collection: DBCollections.Stories,
    fieldsToUpdate,
  });

  try {
    const result = await stories.findOneAndUpdate(
      { _id: new ObjectId(storyId) },
      { $set: fieldsToUpdate },
      { returnOriginal: false }
    );

    if (result.value) {
      console.log("✅ Document updated successfully.");

      return result.value;
    }
  } catch (error) {
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
    throw new Error("❌ Failed to delete document!", error);
  }
};
