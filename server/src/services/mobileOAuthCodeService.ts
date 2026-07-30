import { randomBytes } from "crypto";

import { getCollection, DBCollectionsEnum } from "../models/mongoDb";

const CODE_TTL_MS = 2 * 60 * 1000;
export const MOBILE_OAUTH_CODE_HEX_LENGTH = 64;

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

const normalizeOAuthCode = (raw: string): string | null => {
  const hex = raw.replace(/[^a-f0-9]/gi, "");
  if (hex.length !== MOBILE_OAUTH_CODE_HEX_LENGTH) {
    return null;
  }
  return hex.toLowerCase();
};

const consumeCode = async (code: string): Promise<string | null> => {
  await ensureIndexes();

  const normalizedCode = normalizeOAuthCode(code);
  if (!normalizedCode) {
    return null;
  }

  const collection = getCollection<MobileOAuthCodeDocument>(
    DBCollectionsEnum.mobileOAuthCodes,
  );

  const minCreatedAt = new Date(Date.now() - CODE_TTL_MS);
  const result = await collection.findOneAndDelete({
    code: normalizedCode,
    createdAt: { $gte: minCreatedAt },
  });

  if (!result) {
    return null;
  }

  // MongoDB driver 6+ returns the document directly; older drivers used { value }.
  const document =
    typeof result === "object" &&
    result !== null &&
    "value" in result &&
    (result as { value?: MobileOAuthCodeDocument | null }).value
      ? (result as { value: MobileOAuthCodeDocument }).value
      : (result as MobileOAuthCodeDocument);

  return document?.userId ?? null;
};

export const MobileOAuthCodeService = {
  createCode,
  consumeCode,
};
