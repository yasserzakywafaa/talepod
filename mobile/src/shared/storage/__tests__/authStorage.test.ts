import APP_CONSTANTS from "src/application/shared/app_constants";
import type AsyncStorageModule from "@react-native-async-storage/async-storage";
import type * as SecureStoreModule from "expo-secure-store";
import type * as AuthStorageModule from "src/shared/storage/authStorage";

const { ACCESS_TOKEN, REFRESH_TOKEN, USER, AUTHENTICATED } =
  APP_CONSTANTS.LOCAL_STORAGE;

/**
 * `authStorage` holds a module-level in-memory cache, so each test needs a
 * genuinely fresh copy or state leaks between cases.
 *
 * `jest.resetModules()` clears the whole registry, including the mocked
 * `expo-secure-store` and `@react-native-async-storage/async-storage` — the
 * next `require` of either creates a brand-new mock instance with its own
 * empty store. A *static* top-level import of those mocks would therefore
 * point at a stale instance the moment a test calls this, silently seeding
 * data nothing under test can see. Requiring everything together, after the
 * reset, keeps every module in a test looking at the same instances.
 */
type Modules = {
  authStorage: typeof AuthStorageModule;
  AsyncStorage: typeof AsyncStorageModule;
  SecureStore: typeof SecureStoreModule;
};

const loadModules = (): Modules => {
  jest.resetModules();
  return {
    authStorage: require("src/shared/storage/authStorage") as typeof AuthStorageModule,
    // The mock's module.exports *is* the storage object — no `.default`.
    AsyncStorage: require(
      "@react-native-async-storage/async-storage",
    ) as unknown as typeof AsyncStorageModule,
    SecureStore: require("expo-secure-store") as typeof SecureStoreModule,
  };
};

describe("getStoredAuth", () => {
  it("reads tokens from the keychain and the user from AsyncStorage", async () => {
    const { authStorage, AsyncStorage, SecureStore } = loadModules();
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, JSON.stringify({ _id: "u1" }));
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");
    await SecureStore.setItemAsync(REFRESH_TOKEN, "refresh-1");

    const auth = await authStorage.getStoredAuth();

    expect(auth).toEqual({
      isAuthenticated: true,
      user: { _id: "u1" },
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
  });

  it("hits storage once, then serves later reads from memory", async () => {
    const { authStorage, SecureStore } = loadModules();
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    await authStorage.getStoredAuth();
    const callsAfterFirst = (SecureStore.getItemAsync as jest.Mock).mock.calls
      .length;

    await authStorage.getStoredAuth();
    await authStorage.getStoredAuth();

    // The whole point of the cache: per-request auth reads must not go on
    // touching the keychain.
    expect((SecureStore.getItemAsync as jest.Mock).mock.calls.length).toBe(
      callsAfterFirst,
    );
  });

  it("coalesces concurrent cold reads into a single hydration", async () => {
    const { authStorage, SecureStore } = loadModules();
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    await Promise.all([
      authStorage.getStoredAuth(),
      authStorage.getStoredAuth(),
      authStorage.getStoredAuth(),
    ]);

    // One read per key, not three.
    const accessReads = (
      SecureStore.getItemAsync as jest.Mock
    ).mock.calls.filter(([key]) => key === ACCESS_TOKEN);
    expect(accessReads).toHaveLength(1);
  });

  it("survives a corrupted user record instead of throwing on launch", async () => {
    const { authStorage, AsyncStorage } = loadModules();
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, "{not-json");

    const auth = await authStorage.getStoredAuth();

    expect(auth.user).toBeNull();
    expect(auth.isAuthenticated).toBe(true);
  });

  it("migrates a legacy AsyncStorage token into the keychain once", async () => {
    const { authStorage, AsyncStorage, SecureStore } = loadModules();
    await AsyncStorage.setItem(ACCESS_TOKEN, "legacy-token");

    const auth = await authStorage.getStoredAuth();

    expect(auth.accessToken).toBe("legacy-token");
    expect(await SecureStore.getItemAsync(ACCESS_TOKEN)).toBe("legacy-token");
    expect(await AsyncStorage.getItem(ACCESS_TOKEN)).toBeNull();
  });
});

describe("getCachedAccessToken", () => {
  it("returns null before hydration and the token afterwards", async () => {
    const { authStorage, SecureStore } = loadModules();
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");

    expect(authStorage.getCachedAccessToken()).toBeNull();
    await authStorage.getStoredAuth();
    expect(authStorage.getCachedAccessToken()).toBe("access-1");
  });
});

describe("setStoredTokens", () => {
  it("replaces the tokens without dropping the cached user", async () => {
    const { authStorage, AsyncStorage, SecureStore } = loadModules();
    await AsyncStorage.setItem(AUTHENTICATED, "true");
    await AsyncStorage.setItem(USER, JSON.stringify({ _id: "u1" }));
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");
    await SecureStore.setItemAsync(REFRESH_TOKEN, "refresh-1");
    await authStorage.getStoredAuth();

    await authStorage.setStoredTokens("access-2", "refresh-2");

    const auth = await authStorage.getStoredAuth();
    expect(auth.user).toEqual({ _id: "u1" });
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.accessToken).toBe("access-2");
    // The refreshed token must be visible to the interceptor immediately —
    // otherwise the retried request replays the token that just 401'd.
    expect(authStorage.getCachedAccessToken()).toBe("access-2");
  });
});

describe("clearStoredAuth", () => {
  it("empties the cache and the keychain", async () => {
    const { authStorage, SecureStore } = loadModules();
    await SecureStore.setItemAsync(ACCESS_TOKEN, "access-1");
    await authStorage.getStoredAuth();

    await authStorage.clearStoredAuth();

    expect(authStorage.getCachedAccessToken()).toBeNull();
    expect(await SecureStore.getItemAsync(ACCESS_TOKEN)).toBeNull();

    const auth = await authStorage.getStoredAuth();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
  });
});
