import { DBCollections, database } from ".";

import { ObjectId } from "mongodb";
import { Story } from "../types";

// Create a new document
export const createDocument = async (
  story: Story,
  collectionName: DBCollections
) => {
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(story);

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
  updateFields: Partial<Story>
) => {
  const stories = database.collection(collectionName);

  try {
    const result = await stories.findOneAndUpdate(
      { _id: new ObjectId(storyId) },
      { $set: updateFields },
      { returnOriginal: false }
    );
    console.log("✅ Document updated successfully.");

    return result.value;
  } catch (error) {
    throw new Error("❌ Failed to updated document!", error);
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
