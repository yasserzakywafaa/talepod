import type { User } from "src/shared/types/user";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";

/**
 * Every stored session and every refetch goes through this. If `_id` comes
 * back in a shape the app does not expect, requests keyed on the user id fail
 * quietly rather than loudly — which is exactly the kind of break worth a test.
 */
const asUser = (value: unknown) => value as User;

describe("normalizeUserFromApi", () => {
  it("leaves a plain string id alone", () => {
    const user = normalizeUserFromApi(
      asUser({ _id: "507f1f77bcf86cd799439011", email: "a@b.com" }),
    );

    expect(user._id).toBe("507f1f77bcf86cd799439011");
  });

  it("unwraps extended-JSON `$oid` from the API", () => {
    const user = normalizeUserFromApi(
      asUser({ _id: { $oid: "507f1f77bcf86cd799439011" } }),
    );

    expect(user._id).toBe("507f1f77bcf86cd799439011");
  });

  it("stringifies an ObjectId-like value", () => {
    const objectIdLike = {
      toString: () => "507f1f77bcf86cd799439011",
    };

    const user = normalizeUserFromApi(asUser({ _id: objectIdLike }));

    expect(user._id).toBe("507f1f77bcf86cd799439011");
    expect(typeof user._id).toBe("string");
  });

  it("preserves the rest of the record", () => {
    const user = normalizeUserFromApi(
      asUser({
        _id: "u1",
        email: "a@b.com",
        preferences: { theme: "dark" },
      }),
    );

    expect(user.email).toBe("a@b.com");
    expect(user.preferences).toEqual({ theme: "dark" });
  });

  it("passes a missing id through without inventing one", () => {
    const user = normalizeUserFromApi(asUser({ email: "a@b.com" }));

    expect(user._id).toBeUndefined();
  });
});
