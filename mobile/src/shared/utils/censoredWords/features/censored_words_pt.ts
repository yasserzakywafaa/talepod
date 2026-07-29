import APP_CONSTANTS from "src/application/shared/app_constants";
import loadCensoredWords from "../loadCensoredWords";

let censored_words_en = new Set([
  "aborto",
  "amador",
  "ânus",
  "aranha",
  "ariano",
  "balalao",
  "bastardo",
  "bicha",
  "biscate",
  "bissexual",
  "boceta",
  "boob",
  "bosta",
  "braulio de borracha",
  "bumbum",
  "burro",
  "cabrao",
  "cacete",
  "cagar",
  "camisinha",
  "caralho",
  "cerveja",
  "chochota",
  "chupar",
  "clitoris",
  "cocaína",
  "coito",
  "colhoes",
  "comer",
  "cona",
  "consolo",
  "corno",
  "cu",
  "dar o rabo",
  "dum raio",
  "esporra",
  "fecal",
  "filho da puta",
  "foda",
  "foda-se",
  "foder",
  "frango assado",
  "gozar",
  "grelho",
  "heroína",
  "heterosexual",
  "homem gay",
  "homoerótico",
  "homosexual",
  "inferno",
  "lésbica",
  "lolita",
  "mama",
  "merda",
  "paneleiro",
  "passar um cheque",
  "pau",
  "peidar",
  "pênis",
  "pinto",
  "porra",
  "puta",
  "puta que pariu",
  "puta que te pariu",
  "queca",
  "sacanagem",
  "saco",
  "torneira",
  "transar",
  "vadia",
  "vai-te foder",
  "vai tomar no cu",
  "veado",
  "vibrador",
  "xana",
  "xochota",
]);

if (!censored_words_en.keys.length) {
  async () => {
    try {
      censored_words_en = await loadCensoredWords(
        APP_CONSTANTS.CENSORED_WORDS_FETCH_URLS.PT
      );
    } catch (error) {
      throw new Error(`❌ Error loading censored words [PT]! ${error}`);
    }
  };
}

export default censored_words_en;
