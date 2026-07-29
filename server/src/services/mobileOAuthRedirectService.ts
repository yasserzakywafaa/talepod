import { randomUUID } from "crypto";

import CONFIG from "../config";
import { getCollection, DBCollectionsEnum } from "../models/mongoDb";

const SESSION_TTL_MS = 10 * 60 * 1000;

type MobileOAuthRedirectDocument = {
  stateToken: string;
  redirectUri: string;
  createdAt: Date;
};

let indexesEnsured = false;

const ensureIndexes = async (): Promise<void> => {
  if (indexesEnsured) {
    return;
  }

  const collection = getCollection<MobileOAuthRedirectDocument>(
    DBCollectionsEnum.mobileOAuthRedirects,
  );

  await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 });
  await collection.createIndex({ stateToken: 1 }, { unique: true });

  indexesEnsured = true;
};

export const isAllowedMobileOAuthRedirectUri = (redirectUri: string): boolean => {
  if (!redirectUri || redirectUri.length > 2048) {
    return false;
  }

  const allowedPrefixes = [
    `${CONFIG.MOBILE_OAUTH_SCHEME}://`,
    "exp://",
    "exp+",
    "http://localhost",
    "http://127.0.0.1",
  ];

  return allowedPrefixes.some((prefix) => redirectUri.startsWith(prefix));
};

export const appendQueryToRedirectUri = (
  redirectUri: string,
  query: Record<string, string>,
): string => {
  const params = new URLSearchParams(query).toString();
  if (!params) {
    return redirectUri;
  }

  const separator = redirectUri.includes("?") ? "&" : "?";
  return `${redirectUri}${separator}${params}`;
};

const saveRedirect = async (
  stateToken: string,
  redirectUri: string,
): Promise<void> => {
  await ensureIndexes();

  const collection = getCollection<MobileOAuthRedirectDocument>(
    DBCollectionsEnum.mobileOAuthRedirects,
  );

  await collection.insertOne({
    stateToken,
    redirectUri,
    createdAt: new Date(),
  });
};

const getRedirectUri = async (stateToken: string): Promise<string | null> => {
  await ensureIndexes();

  if (!stateToken) {
    return null;
  }

  const collection = getCollection<MobileOAuthRedirectDocument>(
    DBCollectionsEnum.mobileOAuthRedirects,
  );

  const minCreatedAt = new Date(Date.now() - SESSION_TTL_MS);
  const doc = await collection.findOne({
    stateToken,
    createdAt: { $gte: minCreatedAt },
  });

  return doc?.redirectUri ?? null;
};

const deleteRedirect = async (stateToken: string): Promise<void> => {
  const collection = getCollection<MobileOAuthRedirectDocument>(
    DBCollectionsEnum.mobileOAuthRedirects,
  );
  await collection.deleteOne({ stateToken });
};

const createMobileOAuthState = async (redirectUri: string): Promise<string> => {
  const stateToken = randomUUID();
  await saveRedirect(stateToken, redirectUri);
  return stateToken;
};

const resolveMobileOAuthRedirect = async (
  oauthState: string,
  query: Record<string, string>,
): Promise<string | null> => {
  if (!oauthState.startsWith("mobile:")) {
    return null;
  }

  const stateToken = oauthState.slice("mobile:".length);
  const redirectUri = await getRedirectUri(stateToken);
  if (!redirectUri) {
    return null;
  }

  await deleteRedirect(stateToken);
  return appendQueryToRedirectUri(redirectUri, query);
};

export const MobileOAuthRedirectService = {
  createMobileOAuthState,
  resolveMobileOAuthRedirect,
};
