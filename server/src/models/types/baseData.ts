import { SupportedLanguages } from "src/utils/languages";

export interface BaseDataParams {
  language: SupportedLanguages;
  data: string[];
}
