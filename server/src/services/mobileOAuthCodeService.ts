import { randomBytes } from "crypto";

import { getCollection, DBCollectionsEnum } from "../models/mongoDb";

const CODE_TTL_MS = 2 * 60 * 1000;

type MobileOAuthCodeDocument = {
  code: string;
  userId: string;
  createdAt: Date;
};

let indexesEnsured = false;

const ensureIndexes = async (): Promise<void> => {
  if (indexesEnsured) {
    return;
  }

  const collection = getCollection<MobileOAuthCodeDocument>(
    DBCollectionsEnum.mobileOAuthCodes,
  );

  await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 120 });
  await collection.createIndex({ code: 1 }, { unique: true });

  indexesEnsured = true;
};

const createCode = async (userId: string): Promise<string> => {
  await ensureIndexes();

  const code = randomBytes(32).toString("hex");
  const collection = getCollection<MobileOAuthCodeDocument>(
    DBCollectionsEnum.mobileOAuthCodes,
  );

  await collection.insertOne({
    code,
    userId,
    createdAt: new Date(),
  });

  return code;
};

const consumeCode = async (code: string): Promise<string | null> => {
  await ensureIndexes();

  if (!code || typeof code !== "string") {
    return null;
  }

  const collection = getCollection<MobileOAuthCodeDocument>(
    DBCollectionsEnum.mobileOAuthCodes,
  );

  const minCreatedAt = new Date(Date.now() - CODE_TTL_MS);
  const result = await collection.findOneAndDelete({
    code,
    createdAt: { $gte: minCreatedAt },
  });

  const document = result as MobileOAuthCodeDocument | null;
  return document?.userId ?? null;
};

export const MobileOAuthCodeService = {
  createCode,
  consumeCode,
};
