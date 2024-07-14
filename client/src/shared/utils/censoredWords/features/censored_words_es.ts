import APP_CONSTANTS from "src/application/shared/app_constants";
import loadCensoredWords from "../loadCensoredWords";

let censored_words_en = new Set([
  "Asesinato",
  "asno",
  "bastardo",
  "Bollera",
  "Cabrón",
  "Caca",
  "Chupada",
  "Chupapollas",
  "Chupetón",
  "concha",
  "Concha de tu madre",
  "Coño",
  "Coprofagía",
  "Culo",
  "Drogas",
  "Esperma",
  "Fiesta de salchichas",
  "Follador",
  "Follar",
  "Gilipichis",
  "Gilipollas",
  "Hacer una paja",
  "Haciendo el amor",
  "Heroína",
  "Hija de puta",
  "Hijaputa",
  "Hijo de puta",
  "Hijoputa",
  "Idiota",
  "Imbécil",
  "infierno",
  "Jilipollas",
  "Kapullo",
  "Lameculos",
  "Maciza",
  "Macizorra",
  "maldito",
  "Mamada",
  "Marica",
  "Maricón",
  "Mariconazo",
  "martillo",
  "Mierda",
  "Nazi",
  "Orina",
  "Pedo",
  "Pendejo",
  "Pervertido",
  "Pezón",
  "Pinche",
  "Pis",
  "Prostituta",
  "Puta",
  "Racista",
  "Ramera",
  "Sádico",
  "Semen",
  "Sexo",
  "Sexo oral",
  "Soplagaitas",
  "Soplapollas",
  "Tetas grandes",
  "Tía buena",
  "Travesti",
  "Trio",
  "Verga",
  "vete a la mierda",
  "Vulva",
]);

if (!censored_words_en.keys.length) {
  async () => {
    try {
      censored_words_en = await loadCensoredWords(
        APP_CONSTANTS.CENSORED_WORDS_FETCH_URLS.ES
      );
    } catch (error) {
      throw new Error(`❌ Error loading censored words [ES]! ${error}`);
    }
  };
}

export default censored_words_en;
