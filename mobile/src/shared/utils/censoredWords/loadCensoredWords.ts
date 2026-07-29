import axios from "axios";

export const loadCensoredWords = async (
  censoredWordsUrlToFetch: string
): Promise<Set<string>> => {
  let censoredWords: Set<string> = new Set();

  try {
    const response = await axios(censoredWordsUrlToFetch);
    const text = await response.data;
    censoredWords = text
      .split("\n")
      .map((word: string) => word.trim())
      .filter((word: string) => word.length > 0);
  } catch (error) {
    console.error("❌ Error fetching or writing censored words!", error);
  }

  return censoredWords;
};

export default loadCensoredWords;
