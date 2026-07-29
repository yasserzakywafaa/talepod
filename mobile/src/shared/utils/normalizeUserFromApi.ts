import type { User } from "src/shared/types/user";

/** Ensures Mongo `_id` from API JSON is a string for storage and refetch. */
export const normalizeUserFromApi = (user: User): User => {
  const rawId = user._id as unknown;
  let _id = user._id;

  if (rawId != null && typeof rawId === "object") {
    const oid = (rawId as { $oid?: string }).$oid;
    if (oid) {
      _id = oid;
    }
  }

  if (_id != null) {
    _id = String(_id);
  }

  return { ...user, _id };
};
