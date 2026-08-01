import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import APP_CONSTANTS from "src/application/shared/app_constants";

const { ACCESS_TOKEN, REFRESH_TOKEN, USER, AUTHENTICATED } =
  APP_CONSTANTS.LOCAL_STORAGE;

/**
 * `authStorage` holds a module-level cache, so each test needs a fresh copy
 * of the module or state leaks between cases.
 */
const loadModule = async () => {
  jest.resetModules();
  return import("src/shared/storage/authStorage");
};

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  await SecureStore.deleteItemAsync(ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN);
});

describe("getStoredAuth", () => {
  it("reads tokens from the keychain and the user from AsyncStorage", async () => {
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, JSON.stringify({ _id: "u1" }));
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");
    await SecureStore.setItemAsync(REFRESH_TOKEN, "refresh-1");

    const { getStoredAuth } = await loadModule();
    const auth = await getStoredAuth();

    expect(auth).toEqual({
      isAuthenticated: true,
      user: { _id: "u1" },
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
  });

  it("hits storage once, then serves later reads from memory", async () => {
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    const { getStoredAuth } = await loadModule();
    await getStoredAuth();
    const callsAfterFirst = (SecureStore.getItemAsync as jest.Mock).mock.calls
      .length;

    await getStoredAuth();
    await getStoredAuth();

    // The whole point of the cache: per-request auth reads must not go on
    // touching the keychain.
    expect((SecureStore.getItemAsync as jest.Mock).mock.calls.length).toBe(
      callsAfterFirst,
    );
  });

  it("coalesces concurrent cold reads into a single hydration", async () => {
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    const { getStoredAuth } = await loadModule();
    await Promise.all([getStoredAuth(), getStoredAuth(), getStoredAuth()]);

    // One read per key, not three.
    const accessReads = (
      SecureStore.getItemAsync as jest.Mock
    ).mock.calls.filter(([key]) => key === ACCESS_TOKEN);
    expect(accessReads).toHaveLength(1);
  });

  it("survives a corrupted user record instead of throwing on launch", async () => {
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, "{not-json");

    const { getStoredAuth } = await loadModule();
    const auth = await getStoredAuth();

    expect(auth.user).toBeNull();
    expect(auth.isAuthenticated).toBe(true);
  });

  it("migrates a legacy AsyncStorage token into the keychain once", async () => {
    await AsyncStorage.setItem(ACCESS_TOKEN, "legacy-token");

    const { getStoredAuth } = await loadModule();
    const auth = await getStoredAuth();

    expect(auth.accessToken).toBe("legacy-token");
    expect(await SecureStore.getItemAsync(ACCESS_TOKEN)).toBe("legacy-token");
    expect(await AsyncStorage.getItem(ACCESS_TOKEN)).toBeNull();
  });
});

describe("getCachedAccessToken", () => {
  it("returns null before hydration and the token afterwards", async () => {
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    const { getStoredAuth, getCachedAccessToken } = await loadModule();

    expect(getCachedAccessToken()).toBeNull();
    await getStoredAuth();
    expect(getCachedAccessToken()).toBe("access-1");
  });
});

describe("setStoredTokens", () => {
  it("replaces the tokens without dropping the cached user", async () => {
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, JSON.stringify({ _id: "u1" }));
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");
    await SecureStore.setItemAsync(REFRESH_TOKEN, "refresh-1");

    const { getStoredAuth, setStoredTokens, getCachedAccessToken } =
      await loadModule();
    await getStoredAuth();

    await setStoredTokens("access-2", "refresh-2");

    const auth = await getStoredAuth();
    expect(auth.user).toEqual({ _id: "u1" });
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.accessToken).toBe("access-2");
    // The refreshed token must be visible to the interceptor immediately —
    // otherwise the retried request replays the token that just 401'd.
    expect(getCachedAccessToken()).toBe("access-2");
  });
});

describe("clearStoredAuth", () => {
  it("empties the cache and the keychain", async () => {
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    const { getStoredAuth, clearStoredAuth, getCachedAccessToken } =
      await loadModule();
    await getStoredAuth();

    await clearStoredAuth();

    expect(getCachedAccessToken()).toBeNull();
    expect(await SecureStore.getItemAsync(ACCESS_TOKEN)).toBeNull();

    const auth = await getStoredAuth();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
  });
});
