import CONFIG from "../config";
import {
  DBCollectionsEnum,
  database,
  getDocumentFromDb,
  getDocumentsByQueryFromDb,
} from "../models/mongoDb";
import { Story } from "../models/types/story";
import { User, UserRole } from "../models/types/user";
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { deleteObjectByUrl } from "./amazonS3";

const secretKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_SECRET_KEY
  : CONFIG.STRIPE_LIVE_SECRET_KEY;

const stripe = new Stripe(secretKey ?? "", { typescript: true });

export interface DeleteUserAccountOptions {
  blockAdminSelfDelete?: boolean;
}

export interface UserDeletionResult {
  deleted: {
    stories: number;
    avatars: number;
  };
  warnings: string[];
}

const isAdminRole = (role: UserRole): boolean =>
  role === UserRole.admin || role === UserRole.super_admin;

const cleanupStripeForUser = async (user: User): Promise<string[]> => {
  const warnings: string[] = [];

  try {
    const subscriptionId = user.subscription?.id;
    if (subscriptionId) {
      await stripe.subscriptions.cancel(subscriptionId);
    }
  } catch (error) {
    console.error(
      "❌ Failed to cancel Stripe subscription during account deletion:",
      error,
    );
    warnings.push("stripe_subscription_cancel_failed");
  }

  try {
    if (user.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId);
    }
  } catch (error) {
    console.error(
      "❌ Failed to delete Stripe customer during account deletion:",
      error,
    );
    warnings.push("stripe_customer_delete_failed");
  }

  return warnings;
};

const collectStoryAssetUrls = (story: Story): string[] => {
  const urls: string[] = [];

  if (story.coverImageUrl) urls.push(story.coverImageUrl);
  if (story.audioFile?.url) urls.push(story.audioFile.url);
  if (story.pdfUrl) urls.push(story.pdfUrl);

  for (const page of story.pages ?? []) {
    if (page.imageUrl) urls.push(page.imageUrl);
  }

  for (const image of story.longStoryImages ?? []) {
    if (image.imageUrl) urls.push(image.imageUrl);
  }

  return urls;
};

const deleteStoryAssets = async (stories: Story[]): Promise<void> => {
  const urls = new Set<string>();
  for (const story of stories) {
    for (const url of collectStoryAssetUrls(story)) {
      urls.add(url);
    }
  }

  await Promise.all([...urls].map((url) => deleteObjectByUrl(url)));
};

export const deleteUserAccount = async (
  userId: string,
  options: DeleteUserAccountOptions = {},
): Promise<UserDeletionResult> => {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = (await getDocumentFromDb(
    new ObjectId(userId),
    DBCollectionsEnum.users,
  )) as User | null;

  if (!user || !user._id) {
    throw new Error("User not found");
  }

  if (options.blockAdminSelfDelete && isAdminRole(user.role)) {
    throw new Error("Admin accounts cannot be deleted via self-service");
  }

  const userObjectId = user._id;
  const userIdString = userObjectId.toString();
  const warnings: string[] = [];

  const stories = (await getDocumentsByQueryFromDb<Story>(
    { author: userObjectId },
    DBCollectionsEnum.stories,
  )) as Story[];

  await deleteStoryAssets(stories);
  warnings.push(...(await cleanupStripeForUser(user)));

  const storiesCollection = database.collection(DBCollectionsEnum.stories);
  const avatarsCollection = database.collection(DBCollectionsEnum.avatars);
  const usersCollection = database.collection(DBCollectionsEnum.users);

  const storiesDeleteResult = await storiesCollection.deleteMany({
    author: userObjectId,
  });

  const avatarsDeleteResult = await avatarsCollection.deleteMany({
    userId: userIdString,
  });

  const userDeleteResult = await usersCollection.deleteOne({
    _id: userObjectId,
  });

  if (userDeleteResult.deletedCount === 0) {
    throw new Error("Failed to delete user account");
  }

  console.log("✅ User account deleted successfully:", {
    userId: userIdString,
    storiesDeleted: storiesDeleteResult.deletedCount,
    avatarsDeleted: avatarsDeleteResult.deletedCount,
    warnings,
  });

  return {
    deleted: {
      stories: storiesDeleteResult.deletedCount,
      avatars: avatarsDeleteResult.deletedCount,
    },
    warnings,
  };
};
