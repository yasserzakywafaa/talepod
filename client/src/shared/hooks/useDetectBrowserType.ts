export enum BrowsersEnum {
  Chrome = "Chrome",
  Opera = "Opera",
  OPR = "OPR",
  Safari = "Safari",
  Edge = "Edg",
  Firefox = "Firefox",
  MSIE = "MSIE",
}

export const useDetectBrowserType = () => {
  const BROWSER = {
    Chrome: false,
    Opera: false,
    Safari: false,
    Edge: false,
    Firefox: false,
    MSIE: false,
  };
  const userAgent = window.navigator.userAgent;

  const hasIndex = (args: string) => userAgent.indexOf(args) !== -1;

  // Detects if device is in standalone mode
  const isInStandaloneMode =
    "standalone" in window.navigator && window.navigator.standalone;

  // Detects if device is on iOS
  const isIos = /iphone|ipad|ipod/.test(userAgent.toLowerCase());

  switch (true) {
    case hasIndex(BrowsersEnum.Opera):
      BROWSER.Opera = true;
      break;
    case hasIndex(BrowsersEnum.Edge):
      BROWSER.Edge = true;
      break;
    case hasIndex(BrowsersEnum.Chrome):
      BROWSER.Chrome = true;
      break;
    case hasIndex(BrowsersEnum.Safari):
      BROWSER.Safari = true;
      break;
    case hasIndex(BrowsersEnum.Firefox):
      BROWSER.Firefox = true;
      break;
    case hasIndex(BrowsersEnum.MSIE):
      BROWSER.MSIE = true;
      break;
    default:
      break;
  }

  return { BROWSER, isInStandaloneMode, isIos };
};
