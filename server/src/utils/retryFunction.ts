const retry = async <T>(
  callbackFn: () => T,
  numberOfRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let index = 0; index < numberOfRetries; index++) {
    try {
      return await callbackFn();
    } catch (error) {
      console.error(`❌ Attempt ${index + 1} failed!`, [error]);

      await new Promise((res) => setTimeout(res, delay));

      if (index === numberOfRetries - 1) {
        // Rethrow the last error after all retries fail
        throw new Error("❌ Retries exceeded without successful execution!");
      }
    }
  }

  return undefined;
};

export default retry;
