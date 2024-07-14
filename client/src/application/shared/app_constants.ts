const APP_CONSTANTS = {
  DESIGN: {
    LOCAL_STORAGE_APP_THEME: "appTheme",
  },
  // Variables
  DEV_CLIENT_PORT: process.env.REACT_APP_PORT,
  DEV_SERVER_PORT: process.env.REACT_APP_SERVER_PORT,
  DEV_API_URL: process.env.REACT_APP_DEV_API_URL,
  PROD_API_URL: process.env.REACT_APP_PROD_API_URL,
  // Environment
  IS_DEV_LOCAL_SERVER: process.env.REACT_APP_IS_DEV_LOCAL_SERVER === "true",
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
  // Auth
  GOOGLE_AUTH_CLIENT_ID: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
  // Censored Words
  CENSORED_WORDS_FETCH_URLS: {
    EN: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en",
    AR: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ar",
    FR: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/fr",
    ES: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/es",
    DE: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/de",
    PT: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/pt",
    IT: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/it",
    JA: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ja",
    KO: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ko",
    RU: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ru",
    HI: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/hi",
    ZH: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/zh",
  },
};

export default APP_CONSTANTS;
