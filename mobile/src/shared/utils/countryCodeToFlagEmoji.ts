import type { CountryCode } from "react-native-country-picker-modal";

/** Regional-indicator emoji from ISO 3166-1 alpha-2 (works without node-emoji / image CDN). */
export const countryCodeToFlagEmoji = (countryCode: CountryCode): string =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
