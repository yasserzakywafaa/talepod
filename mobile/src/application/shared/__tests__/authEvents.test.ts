import {
  emitSessionExpired,
  onSessionExpired,
} from "src/application/shared/authEvents";

describe("session expiry events", () => {
  it("notifies every subscriber", () => {
    const first = jest.fn();
    const second = jest.fn();

    const unsubscribeFirst = onSessionExpired(first);
    const unsubscribeSecond = onSessionExpired(second);

    emitSessionExpired();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);

    unsubscribeFirst();
    unsubscribeSecond();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = jest.fn();
    const unsubscribe = onSessionExpired(listener);

    unsubscribe();
    emitSessionExpired();

    expect(listener).not.toHaveBeenCalled();
  });

  it("keeps going when one subscriber throws", () => {
    const throwing = jest.fn(() => {
      throw new Error("boom");
    });
    const healthy = jest.fn();

    const unsubscribeThrowing = onSessionExpired(throwing);
    const unsubscribeHealthy = onSessionExpired(healthy);

    // A broken listener must not prevent the rest of the app from signing out.
    expect(() => emitSessionExpired()).not.toThrow();
    expect(healthy).toHaveBeenCalledTimes(1);

    unsubscribeThrowing();
    unsubscribeHealthy();
  });
});
