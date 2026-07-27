import APP_CONSTANTS from "src/application/shared/app_constants";
import loadCensoredWords from "../loadCensoredWords";

let censored_words_en = new Set([
  "analritter",
  "arsch",
  "arschficker",
  "arschlecker",
  "arschloch",
  "bimbo",
  "bratze",
  "bumsen",
  "bonze",
  "dödel",
  "fick",
  "ficken",
  "flittchen",
  "fotze",
  "fratze",
  "hackfresse",
  "hure",
  "hurensohn",
  "ische",
  "kackbratze",
  "kacke",
  "kacken",
  "kackwurst",
  "kampflesbe",
  "kanake",
  "kimme",
  "lümmel",
  "MILF",
  "möpse",
  "morgenlatte",
  "möse",
  "mufti",
  "muschi",
  "nackt",
  "neger",
  "nigger",
  "nippel",
  "nutte",
  "onanieren",
  "orgasmus",
  "penis",
  "pimmel",
  "pimpern",
  "pinkeln",
  "pissen",
  "pisser",
  "popel",
  "poppen",
  "porno",
  "reudig",
  "rosette",
  "schabracke",
  "schlampe",
  "scheiße",
  "scheisser",
  "schiesser",
  "schnackeln",
  "schwanzlutscher",
  "schwuchtel",
  "tittchen",
  "titten",
  "vögeln",
  "vollpfosten",
  "wichse",
  "wichsen",
  "wichser",
]);

if (!censored_words_en.keys.length) {
  async () => {
    try {
      censored_words_en = await loadCensoredWords(
        APP_CONSTANTS.CENSORED_WORDS_FETCH_URLS.DE
      );
    } catch (error) {
      throw new Error(`❌ Error loading censored words [DE]! ${error}`);
    }
  };
}

export default censored_words_en;
