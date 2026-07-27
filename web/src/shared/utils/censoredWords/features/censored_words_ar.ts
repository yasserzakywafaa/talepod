import APP_CONSTANTS from "src/application/shared/app_constants";
import loadCensoredWords from "../loadCensoredWords";

let censored_words_en = new Set([
  "سكس",
  "طيز",
  "شرج",
  "لعق",
  "لحس",
  "مص",
  "تمص",
  "بيضان",
  "ثدي",
  "بز",
  "بزاز",
  "حلمة",
  "مفلقسة",
  "بظر",
  "كس",
  "فرج",
  "شهوة",
  "شاذ",
  "مبادل",
  "عاهرة",
  "جماع",
  "قضيب",
  "زب",
  "لوطي",
  "لواط",
  "سحاق",
  "سحاقية",
  "اغتصاب",
  "خنثي",
  "احتلام",
  "نيك",
  "متناك",
  "متناكة",
  "شرموطة",
  "عرص",
  "خول",
  "قحبة",
  "لبوة",
]);

if (!censored_words_en.keys.length) {
  async () => {
    try {
      censored_words_en = await loadCensoredWords(
        APP_CONSTANTS.CENSORED_WORDS_FETCH_URLS.AR
      );
    } catch (error) {
      throw new Error(`❌ Error loading censored words [AR]! ${error}`);
    }
  };
}

export default censored_words_en;
