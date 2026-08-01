/* eslint-env jest */

// Native modules have no JS implementation under Jest, so anything that
// touches them at import time has to be mocked here or the suite fails on
// `require` rather than on an assertion.

jest.mock("expo-secure-store", () => {
  const store = new Map();
  return {
    getItemAsync: jest.fn(async (key) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
    __store: store,
  };
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
}));

// The monitoring wrapper already no-ops without a DSN, but stubbing it keeps
// test output clean and asserts nothing tries to report during a unit test.
jest.mock("src/shared/monitoring", () => ({
  initMonitoring: jest.fn(),
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  setMonitoringUser: jest.fn(),
}));
