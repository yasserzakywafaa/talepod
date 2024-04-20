const BROWSER_CONSTANTS = {
  Chrome: "Chrome",
  Opera: "Opera" || "OPR",
  Safari: "Safari",
  Edge: "Edg",
  Firefox: "Firefox",
  MSIE: "MSIE",
};

const BROWSER = {
  Chrome: false,
  Opera: false,
  Safari: false,
  Edge: false,
  Firefox: false,
  MSIE: false,
};

const hasIndex = (args: string) => navigator.userAgent.indexOf(args) !== -1;

const detectBroswerType = () => {
  switch (true) {
    case hasIndex(BROWSER_CONSTANTS.Opera):
      BROWSER.Opera = true;
      break;
    case hasIndex(BROWSER_CONSTANTS.Edge):
      BROWSER.Edge = true;
      break;
    case hasIndex(BROWSER_CONSTANTS.Chrome):
      BROWSER.Chrome = true;
      break;
    case hasIndex(BROWSER_CONSTANTS.Safari):
      BROWSER.Safari = true;
      break;
    case hasIndex(BROWSER_CONSTANTS.Firefox):
      BROWSER.Firefox = true;
      break;
    case hasIndex(BROWSER_CONSTANTS.MSIE):
      BROWSER.MSIE = true;
      break;
    default:
      break;
  }

  return BROWSER;
};

detectBroswerType();

export default BROWSER;
