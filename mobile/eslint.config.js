// Flat config (ESLint 9). `eslint-config-expo` carries the React Native,
// React Hooks and import rules Expo apps need; `eslint-config-prettier` turns
// off the stylistic rules Prettier already owns so the two never disagree.
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "ios/**",
      "android/**",
      "expo-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      /**
       * The whole reason ESLint is here: stale closures and unmemoized
       * context values are the two bugs this codebase actually had. Keep
       * these as errors so a disable comment has to be deliberate.
       */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /**
       * `console.log` ships in release bundles — it is not stripped. Use
       * `src/shared/logger` instead, which is a no-op outside development.
       * `warn`/`error` stay allowed for genuine failures.
       */
      "no-console": ["error", { allow: ["warn", "error"] }],

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // The logger is the one place allowed to touch `console` directly.
    files: ["src/shared/logger.ts"],
    rules: { "no-console": "off" },
  },
];
