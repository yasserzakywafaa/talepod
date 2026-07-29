import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_KEY = "createStoryDraft";
const DRAFT_VERSION = 1;

export const saveCreateDraft = async (draft: object): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ version: DRAFT_VERSION, ...draft }),
    );
  } catch {
    /* skip */
  }
};

export const consumeCreateDraft = async (): Promise<Record<
  string,
  unknown
> | null> => {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    await AsyncStorage.removeItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft?.version === DRAFT_VERSION ? draft : null;
  } catch {
    return null;
  }
};
