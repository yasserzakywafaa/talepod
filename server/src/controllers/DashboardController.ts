import {
  DBCollectionsEnum,
  database,
  deleteDocumentByQuery,
  getPaginatedDocuments,
} from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";
import { PageResponse, Story } from "../models/types";
import { User, UserRole, UserStatus } from "../models/types/user";

import { ObjectId } from "mongodb";
import { getDocumentFromDb } from "../models/mongoDb";

export const getUsersCount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("⌛︎ Getting Users Count...", {
    request: decodeURIComponent(request.path),
  });

  try {
    const collection = database.collection(DBCollectionsEnum.users);
    const count = await collection.countDocuments({
      status: UserStatus.active,
    });

    console.log("✅ Users count fetched:", { count });

    response.status(200).json({ count });
  } catch (error) {
    console.error("❌ Failed to get users count:", error);
    next(error);
  }
};

export const getStoriesCount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("⌛︎ Getting Stories Count...", {
    request: decodeURIComponent(request.path),
  });

  try {
    const collection = database.collection(DBCollectionsEnum.stories);
    const count = await collection.countDocuments({});

    console.log("✅ Stories count fetched:", { count });

    response.status(200).json({ count });
  } catch (error) {
    console.error("❌ Failed to get stories count:", error);
    next(error);
  }
};

export const getAllUsers = async (
  request: Request,
  response: Response<PageResponse<User> | { message: string }>,
  next: NextFunction
) => {
  console.log("⌛︎ Getting All Users...", {
    request: decodeURIComponent(request.path),
  });

  try {
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    const { results, paging } = await getPaginatedDocuments<User>(
      {},
      DBCollectionsEnum.users,
      { pageNumber, pageSize },
      {
        sort: { createdAt: -1 },
      }
    );

    console.log("✅ Users fetched successfully:", {
      totalCount: paging?.totalCount,
      pageNumber,
      pageSize,
    });

    response.status(200).json({
      results,
      paging: paging || {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPagesCount: 0,
      },
    });
  } catch (error) {
    console.error("❌ Failed to get all users:", error);
    next(error);
  }
};

export const blockUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;

  console.log("⌛︎ Blocking User...", {
    userId,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  try {
    const collection = database.collection(DBCollectionsEnum.users);
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status: UserStatus.banned } }
    );

    if (result.matchedCount === 0) {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    console.log("✅ User blocked successfully:", { userId });

    response.status(200).json({
      message: "✅ User blocked successfully",
    });
  } catch (error) {
    console.error("❌ Failed to block user:", error);
    next(error);
  }
};

export const unblockUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;

  console.log("⌛︎ Unblocking User...", {
    userId,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  try {
    const collection = database.collection(DBCollectionsEnum.users);
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status: UserStatus.active } }
    );

    if (result.matchedCount === 0) {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    console.log("✅ User unblocked successfully:", { userId });

    response.status(200).json({
      message: "✅ User unblocked successfully",
    });
  } catch (error) {
    console.error("❌ Failed to unblock user:", error);
    next(error);
  }
};

export const deleteUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;

  console.log("⌛︎ Deleting User...", {
    userId,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  try {
    const collection = database.collection(DBCollectionsEnum.users);
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    console.log("✅ User deleted successfully:", { userId });

    response.status(200).json({
      message: "✅ User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Failed to delete user:", error);
    next(error);
  }
};

export const getAllStories = async (
  request: Request,
  response: Response<PageResponse<Story> | { message: string }>,
  next: NextFunction
) => {
  console.log("⌛︎ Getting All Stories...", {
    request: decodeURIComponent(request.path),
  });

  try {
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    // Define custom pipeline stages for lookup and unwind author profile
    const customPipelineStages = [
      {
        $lookup: {
          from: DBCollectionsEnum.users,
          localField: "author",
          foreignField: "_id",
          as: "authorProfile",
        },
      },
      {
        $unwind: {
          path: "$authorProfile",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const { results, paging } = await getPaginatedDocuments<Story>(
      {},
      DBCollectionsEnum.stories,
      { pageNumber, pageSize },
      {
        customPipelineStages,
        sort: { createdAt: -1 },
      }
    );

    console.log("✅ Stories fetched successfully:", {
      totalCount: paging?.totalCount,
      pageNumber,
      pageSize,
    });

    response.status(200).json({
      results,
      paging: paging || {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPagesCount: 0,
      },
    });
  } catch (error) {
    console.error("❌ Failed to get all stories:", error);
    next(error);
  }
};

export const deleteStory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const storyId = request.params.storyId;

  console.log("⌛︎ Deleting Story...", {
    storyId,
    request: decodeURIComponent(request.path),
  });

  if (!storyId || !ObjectId.isValid(storyId)) {
    response.status(400).json({ message: "❌ Invalid story ID" });
    return;
  }

  try {
    const result = await deleteDocumentByQuery(
      { _id: new ObjectId(storyId) },
      DBCollectionsEnum.stories
    );

    if (result.deletedCount === 0) {
      response.status(404).json({ message: "❌ Story not found" });
      return;
    }

    console.log("✅ Story deleted successfully:", { storyId });

    response.status(200).json({
      message: "✅ Story deleted successfully",
    });
  } catch (error) {
    console.error("❌ Failed to delete story:", error);
    next(error);
  }
};

export const getUserById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;

  console.log("⌛︎ Getting User by ID...", {
    userId,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  try {
    const user = (await getDocumentFromDb(
      new ObjectId(userId),
      DBCollectionsEnum.users
    )) as User | null;

    if (!user) {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    console.log("✅ User fetched successfully:", { userId });

    response.status(200).json(user);
  } catch (error) {
    console.error("❌ Failed to get user:", error);
    next(error);
  }
};

export const getUserStoriesCount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;

  console.log("⌛︎ Getting User Stories Count...", {
    userId,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  try {
    const collection = database.collection(DBCollectionsEnum.stories);
    const count = await collection.countDocuments({
      author: new ObjectId(userId),
    });

    console.log("✅ User stories count fetched:", { userId, count });

    response.status(200).json({ count });
  } catch (error) {
    console.error("❌ Failed to get user stories count:", error);
    next(error);
  }
};

export const updateUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  const { role } = request.body;

  console.log("⌛︎ Updating User Role...", {
    userId,
    role,
    request: decodeURIComponent(request.path),
  });

  if (!userId || !ObjectId.isValid(userId)) {
    response.status(400).json({ message: "❌ Invalid user ID" });
    return;
  }

  if (!role || !Object.values(UserRole).includes(role)) {
    response.status(400).json({ message: "❌ Invalid role" });
    return;
  }

  try {
    const collection = database.collection(DBCollectionsEnum.users);
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    const updatedUser = (await getDocumentFromDb(
      new ObjectId(userId),
      DBCollectionsEnum.users
    )) as User;

    console.log("✅ User role updated successfully:", { userId, role });

    response.status(200).json({
      message: "✅ User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Failed to update user role:", error);
    next(error);
  }
};

const DashboardController = {
  getUsersCount,
  getStoriesCount,
  getAllUsers,
  getUserById,
  getUserStoriesCount,
  updateUserRole,
  blockUser,
  unblockUser,
  deleteUser,
  getAllStories,
  deleteStory,
};

export default DashboardController;
