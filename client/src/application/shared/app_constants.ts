const APP_CONSTANTS = {
  DESIGN: {
    LOCAL_STORAGE_APP_THEME: "appTheme",
  },

  // Variables
  DEV_CLIENT_PORT: import.meta.env.REACT_APP_PORT,
  DEV_SERVER_PORT: import.meta.env.REACT_APP_SERVER_PORT,
  DEV_API_URL: import.meta.env.REACT_APP_DEV_API_URL,
  PROD_API_URL: import.meta.env.REACT_APP_PROD_API_URL,

  // Environment
  IS_LOCAL: import.meta.env.REACT_APP_ENV === "local",
  IS_DEV: import.meta.env.REACT_APP_ENV === "development",
  IS_PROD: import.meta.env.REACT_APP_ENV === "production",

  // Auth
  GOOGLE_OAUTH_CLIENT_ID: import.meta.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,

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
  LOCAL_STORAGE: {
    TOKEN: "token",
    USER: "user",
    AUTHENTICATED: "isAuthenticated",
    STORY_GENERATED: "isBlogGenerated",
  },
  APP_THEME_CLASS: {
    DARK: "dark",
    LIGHT: "light",
  },
  MAX_STORIES_LIMIT_FREE: 4,
  MAX_STORIES_LIMIT_PREMIUM: 50,
  MAX_STORIES_LIMIT_ADVANCED: 999,
  // App Main URL
  APP_URL:
    import.meta.env.REACT_APP_ENV === "local" ||
    import.meta.env.REACT_APP_ENV === "development"
      ? "https://dev.talepod.com"
      : "https://www.talepod.com",
};

export default APP_CONSTANTS;
