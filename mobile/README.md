# TalePod Mobile (Expo)

Expo **SDK 54** — matches **Expo Go** on iOS/Android (e.g. Expo Go 54.x from the App Store).

## Setup

```bash
cd mobile
# Requires GITHUB_PACKAGES_TOKEN for @yasserzakywafaa/client-core (see .npmrc)
yarn install
npx expo install --fix   # align native module versions with SDK 54
```

**TypeScript:** mobile uses `~5.9.2` (Expo SDK 54). The `web/` app may use TypeScript 6.x; keep `paths` in `tsconfig.json` without `baseUrl` so either toolchain stays happy.

```bash
cp .env.example .env       # set EXPO_PUBLIC_LOCAL_API_URL to your Mac LAN IP + server port
```

## Run on a physical iPhone (Expo Go)

1. Install **Expo Go** from the App Store (SDK 54).
2. Mac and iPhone on the **same Wi‑Fi**.
3. Start the API server (`server/`, same `DEV_PORT` as `EXPO_PUBLIC_SERVER_PORT`).
4. `yarn start` (or `npx expo start -c`).
5. Scan the QR code with the **Camera** app → open in Expo Go.

If the device cannot reach your Mac, try `npx expo start --tunnel` (API URL must still be reachable or use a dev API).

## Simulator

```bash
npx expo start --ios
```

## SDK upgrades

Do not bump `expo` without matching **Expo Go** on devices, or use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) (`expo run:ios --device`).

## Navigation (for web / React Router developers)

On **web** (`web/src/application/AppContent.tsx`), one **React Router** tree maps **URLs** to pages: marketing routes, `/login`, `/register`, and a nested `/dashboard/*` layout.

On **mobile**, there is no address bar. [**React Navigation**](https://reactnavigation.org/) keeps a tree of **screens** (stack, drawer, modals/sheets). You still have one app, but the tree has **branches** and **overlays** instead of a flat path list.

This is **not** three separate navigation libraries. It is one `NavigationContainer` (see `application/App.tsx`, like `BrowserRouter`) and one **root stack** with two drawer areas plus **form sheets** on top.

### Tree (what actually runs)

```text
NavigationContainer          ← application/App.tsx, ref={rootNavigationRef}
└── Root stack               ← application/AppContent.tsx
    ├── Main                 ← MainDrawerNavigator (guests + logged-in consumers)
    │   ├── MainShell        ← tabs + stack (Create, My Stories, …; Library/Contact/Pricing on stack when logged in)
    │   └── Public* screens  ← home, pricing, contact, library (guest marketing pages)
    ├── Dashboard            ← ProtectedDashboardNavigator → DashboardDrawerNavigator (admin only)
    │   └── Drawer screens: overview, admin users, admin stories
    ├── ViewStory            ← root stack (slug)
    ├── MyProfile            ← root stack (account menu → Profile, all users)
    └── Stack.Group (formSheet)
        ├── PublicLogin
        ├── PublicRegister
        ├── SheetSettings
        └── SheetAccount
```

**Main** (right drawer) covers public marketing and the logged-in consumer shell. **Dashboard** (left drawer) is admin-only. **Sheets** are like web login/register/settings **modals**: they slide over whatever is underneath.

### `routes.ts` — names, not extra navigators

| Export | Meaning | Web analogy |
|--------|---------|-------------|
| `rootRoutes` | Top stack branches: `Main`, `Dashboard` | Consumer site + app shell vs `/dashboard/*` |
| `mobileRoutes.public` | Drawer screen names under main (`PublicHome`, …) plus **route ids** for login/register sheets | `/`, `/pricing`, `/contact`; login/register are overlays, not drawer pages |
| `mobileRoutes.main` | Logged-in shell (`MainShell`) and tab ids | In-app tabs under the main drawer |
| `mobileRoutes.sheet` | Route ids for menu sheets (`SheetSettings`, `SheetAccount`) | Settings / account dropdown modals |
| `mobileRoutes.dashboard` | Drawer screen names under dashboard | `/dashboard/overview`, `/dashboard/projects`, … |

Login and register live under `public` in the file for **product** naming (auth), but they are registered on the **root stack** as form sheets, not inside the main drawer.

### How to navigate (cheat sheet)

| Goal | API | Example |
|------|-----|---------|
| Change page **inside the open drawer** (main or dashboard) | `navigation.navigate(...)` from that screen or drawer | `navigation.navigate(mobileRoutes.public.pricing)` |
| Open **login / register / settings / account** sheet | `openRootSheet(...)` in `rootNavigation.ts` | `openRootSheet(mobileRoutes.public.login)` |
| Switch to **dashboard** (admin) | `navigateToDashboard()` | Account sheet → Dashboard |
| **Create story** (logged in) | `navigateToCreateStory()` | Main shell app bar / drawer |
| **Profile** (logged in) | `navigateToMainProfileTab()` | Account sheet → Profile |
| Open a story from library | `navigateToViewStory(slug)` | Library list tap |
| Go to **public home** from dashboard | `navigateToMarketingHome()` | Logo in dashboard drawer |
| After **login** / **logout** reset the tree | `resetAfterLogin(user)` / `resetToMarketingAfterLogout()` | Login/Register screens, account sheet logout |

Helpers use `rootNavigationRef` on `NavigationContainer` so you do not walk `navigation.getParent()` from nested drawers.

### Key files

| File | Role |
|------|------|
| `application/App.tsx` | Providers + `NavigationContainer` + `ref={rootNavigationRef}` (parity with `web/…/application/App.tsx`) |
| `application/AppContent.tsx` | Root stack + sheet group (same role as `web/…/AppContent.tsx`) |
| `application/navigation/MainDrawerNavigator.tsx` | Main drawer (guest public pages + logged-in shell) |
| `application/navigation/MainDrawerContent.tsx` | Right drawer menu (auth-aware) |
| `application/navigation/DashboardDrawerNavigator.tsx` | Dashboard drawer |
| `application/navigation/rootNavigation.ts` | `openRootSheet`, `navigateToDashboard`, resets |
| `application/navigation/types.ts` | TypeScript param lists for the root stack |
| `application/navigation/formSheetScreenOptions.ts` | Shared iOS/Android sheet styling |

### Add a new form sheet

1. Add a route name in `application/routes.ts` (and extend `RootSheetRouteName` if needed).
2. Add the screen under `Stack.Group` in `application/AppContent.tsx`.
3. Open it with `openRootSheet(yourRoute)` from buttons or drawer actions.

## Authentication (aligned with `web/`)

Login and Register screens mirror the web app: **Google** and **phone OTP** (expandable phone panel with international country picker).

| Platform | Session                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web      | HTTP-only cookies after Passport OAuth redirect                                                                                                         |
| Mobile   | `Authorization: Bearer` + refresh token in API body (`X-Client-Platform: mobile`). Tokens stored in **expo-secure-store**; user profile in AsyncStorage |

### Phone OTP

Uses the same API routes as web. Numbers are validated to **E.164** with `libphonenumber-js` before send/verify. Default country **PT**; preferred countries **DE, FR, EG, PT** (same as web `mui-tel-input`).

### Google login

Same **server Passport OAuth** as the web app (no Google client IDs in mobile `.env`). Tapping Google opens an in-app browser to `GET /api/v1/auth/google?platform=mobile`; after login the API redirects to your app scheme and the app exchanges a one-time code for JWTs via `POST /api/v1/auth/google/mobile/exchange`.

Works in **Expo Go** and production builds. The app passes its Expo deep link (`Linking.createURL('auth/google')`, usually `exp://…`) as `redirect_uri`; the API redirects back to that exact URL after Google login. Server `MOBILE_OAUTH_SCHEME` must still match your custom scheme for standalone builds.

## Environments (local / dev / prod)

Same three tiers as your web/Vercel/Railway mental model. The **app** only understands `EXPO_PUBLIC_ENV`:

| Your tier | `EXPO_PUBLIC_ENV` | API | Where you set vars |
|-----------|-------------------|-----|-------------------|
| **local** | `local` | `EXPO_PUBLIC_LOCAL_API_URL` (Mac IP) | `mobile/.env` only |
| **dev** | `dev` | `EXPO_PUBLIC_DEV_API_URL` | EAS environment **preview** (Expo’s name, not yours) |
| **prod** | `prod` | `EXPO_PUBLIC_PROD_API_URL` | EAS environment **production** |

Expo’s dashboard still says **preview** / **production** for variable buckets and update branches — think **preview = dev**, **production = prod**. You only type `local` / `dev` / `prod` in `EXPO_PUBLIC_ENV`.

```bash
# local
yarn start

# dev → Expo Go “preview” branch
yarn update:dev

# prod → Expo Go / OTA “production” branch
yarn update:prod
```

Legacy values `development` / `production` in `EXPO_PUBLIC_ENV` still work but prefer **`dev`** / **`prod`**.

## EAS Build (cloud)

`yarn install` on EAS needs a GitHub Packages token (see `.npmrc`). **Create it on Expo before building** — local `.env` is not uploaded.

1. Create a GitHub PAT with **`read:packages`** (classic or fine-grained for `@yasserzakywafaa` packages).

2. From `mobile/`:

```bash
eas login
# Secret for the preview profile (Android APK / internal, iOS simulator)
eas env:create --environment preview --name GITHUB_PACKAGES_TOKEN --value "ghp_xxxx" --visibility secret
# Repeat for production when you ship store builds
eas env:create --environment production --name GITHUB_PACKAGES_TOKEN --value "ghp_xxxx" --visibility secret
```

3. Point **dev** and **prod** at the right APIs (on EAS, not in local `.env`):

```bash
# dev tier → EAS "preview" bucket
eas env:create --environment preview --name EXPO_PUBLIC_ENV --value "dev"
eas env:create --environment preview --name EXPO_PUBLIC_DEV_API_URL --value "https://api-dev.talepod.com"

# prod tier → EAS "production" bucket
eas env:create --environment production --name EXPO_PUBLIC_ENV --value "prod"
eas env:create --environment production --name EXPO_PUBLIC_PROD_API_URL --value "https://api.talepod.com"
```

**Never** set `EXPO_PUBLIC_ENV=local` or `EXPO_PUBLIC_LOCAL_API_URL` on EAS.

4. Publish **dev** to Expo Go:

```bash
yarn update:dev
```

If install still fails with `Failed to replace env in config: ${GITHUB_PACKAGES_TOKEN}`, the variable is missing for that profile’s `environment` in [expo.dev](https://expo.dev) → Project → Environment variables.

## Brand assets (keep in sync with web)

| Mobile path               | Web source                                                  |
| ------------------------- | ----------------------------------------------------------- |
| `assets/icon_512x512.png` | `web/public/icons/icon_512x512.png` (app bar / drawer logo) |

Language labels and flag images come from `@yasserzakywafaa/client-core/native` (`LANGUAGE_OPTIONS`, inlined at build time). No local `assets/flags/` copy is required when using client-core ≥ 0.6.5.

## i18n (aligned with `web/`)

Namespaces under `src/i18n/locales/{en,ar,de,fr}/`: **`common`**, **`auth`**, **`dashboard`**, **`page`** — same files and structure as the web client, with a few extra keys for native-only copy (e.g. `page.home`, `auth.phoneLoginHint`). RTL for Arabic: navigation stays `direction="ltr"` on `NavigationContainer` (drawer stability). Locale layout uses `LocaleLayoutBoundary` on page/drawer content, `LocalePortalBoundary` (not raw Paper `Portal`) for dialogs/overlays, and `useScreenTypography` / `useThemedTextInputProps` for text alignment.

## Quality checks

```bash
yarn typecheck   # tsc --noEmit
yarn lint        # ESLint (expo config + react-hooks as errors)
yarn test        # Jest (jest-expo preset)
yarn format      # Prettier
```

CI runs all four on every PR touching `mobile/`, plus `expo install --check`
so native module versions that have drifted from the SDK fail on the PR
rather than on an EAS build.

Two ESLint rules are deliberately strict:

- **`react-hooks/*`** — stale closures and unmemoized context values are the
  bugs this app actually shipped with.
- **`no-console`** — `console.*` is **not** stripped from release bundles.
  Use `src/shared/logger`, which compiles away outside development. The
  logger itself is the one exemption.

## State management

Two layers, deliberately separate:

| Layer | Owner | Examples |
| --- | --- | --- |
| **Client state** | React context (`application/store`) | Auth, theme preference, language |
| **Server state** | React Query | Story lists, avatars, pricing, admin data |

Client state stays in one application context — that is the app's single
global store and it is not being replaced.

Server state moved to React Query because the hand-rolled version had no
caching, no retry, no refetch-on-reconnect, and duplicated a manual
`isFetching` flag and page-merging logic in every feature.

`application/query/QueryProvider.tsx` wires two React Query defaults that
assume a browser and otherwise silently do nothing on native: online status
(NetInfo, not `navigator.onLine`) and focus (`AppState`, not
`visibilitychange`).

`features/library/useLibraryStories.ts` is the reference migration — read it
before converting another feature. The pattern: server data via
`useQuery`/`useInfiniteQuery` keyed through `shared/api/queryKeys.ts`, and
screen-local UI state (a filter draft, whether a sheet is open) left in
plain `useState`.

Features still on the old `store`/`manager`/`state`/`Provider` quartet:
story creator, my stories, my avatars, profile, and the dashboard screens.
They work — this is an incremental migration, not a broken half-state.

## Crash reporting

`src/shared/monitoring.ts` wraps Sentry so that it:

- no-ops in **Expo Go** (the native module is not in the Expo Go binary) and
  when `EXPO_PUBLIC_SENTRY_DSN` is unset, so local development is unaffected;
- scrubs tokens, auth codes, emails and phone numbers before sending;
- identifies users by opaque id only — never email or phone.

`ErrorBoundary` catches render errors app-wide and per screen. Note what
error boundaries do **not** catch: event handlers, async callbacks, and
request failures. Those go through `logger.error`.

See `docs/STORE_READINESS.md` for the DSN and source-map setup.

## Deep linking

`application/navigation/linking.ts` maps URLs to screens, including cold
starts. Both the `talepod-app://` scheme and `https://talepod.com` links are
declared; the https ones only resolve to the app once the web app serves
`apple-app-site-association` and `assetlinks.json` (see
`docs/STORE_READINESS.md`). Until then they open the website, which is the
correct fallback.

The Google OAuth callback (`auth/google`) is filtered out of the linking
config on purpose — `WebBrowser.openAuthSessionAsync` consumes it, and
letting React Navigation also handle it races that promise.

Test a link without rebuilding:

```bash
npx uri-scheme open "talepod-app://story/some-slug" --ios
npx uri-scheme open "talepod-app://story/some-slug" --android
```

## Arabic and RTL — known limitation

**The app currently renders Arabic in an LTR layout.** Text is translated
and aligned right, but the layout does not mirror: the drawer stays on the
right, back gestures and screen transitions keep their LTR direction, and
`flexDirection: "row"` is not flipped.

This is deliberate, not an oversight. `shared/utils/layoutDirection.ts`
actively calls `I18nManager.forceRTL(false)`, and `NavigationContainer` is
pinned to `direction="ltr"`, because `forceRTL` without a full native
reload breaks touch targets in Expo Go.

What is not established is whether that constraint still applies in a real
build — the Expo Go behaviour was the reason for the workaround, and it has
not been re-tested since. **Before claiming Arabic support in a store
listing, run this in a dev build (not Expo Go):**

1. `npx expo run:ios --device` (or `run:android`) — a real dev build.
2. Switch the app language to Arabic in Settings.
3. Remove the `ensureNativeLtrForTouches()` call and set
   `direction="rtl"` on `NavigationContainer` for the test.
4. Check, in order: can you tap the tab bar and drawer items at all (this is
   the failure the workaround exists for); does the drawer open from the
   correct side; do stack push/pop animations run the right way; are icons
   that imply direction (back chevrons, "next") mirrored.

If touch targets survive in a real build, the workaround can go and the
navigation direction can follow the language. If they do not, keep the
current behaviour and say "Arabic language support" rather than "full RTL"
in the store listing.
