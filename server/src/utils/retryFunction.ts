const retry = async <T>(
  callbackFn: () => T,
  numberOfRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let index = 0; index < numberOfRetries; index++) {
    try {
      return await callbackFn();
    } catch (error) {
      if (index === numberOfRetries - 1) {
        throw new Error(`${error}`); // rethrow the last error after all retries fail
      }
      console.error(`❌ Attempt ${index + 1} failed!`, [error]);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("❌ Retries exceeded without successful execution!");
};

export default retry;
