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

This is **not** three separate navigation libraries. It is one `NavigationContainer` (see `application/App.tsx`, like `BrowserRouter`) and one **root stack** with two main areas plus **form sheets** on top.

### Tree (what actually runs)

```text
NavigationContainer          ← application/App.tsx, ref={rootNavigationRef}
└── Root stack               ← application/AppContent.tsx
    ├── Marketing            ← MarketingDrawerNavigator (public site)
    │   └── Drawer screens: home, pricing, contact, library
    ├── Dashboard            ← ProtectedDashboardNavigator → DashboardDrawerNavigator (admin only)
    │   └── Drawer screens: overview, admin users, admin stories
    ├── Main                 ← ProtectedMainNavigator (logged-in users): drawer + bottom tabs
    │   └── Tabs: Create | My Stories | My Avatars | Profile (opens account sheet)
    ├── ViewStory            ← root stack (slug)
    ├── MyProfile            ← root stack (account menu → Profile, all users)
    └── Stack.Group (formSheet)
        ├── PublicLogin
        ├── PublicRegister
        ├── SheetSettings
        └── SheetAccount
```

**Marketing** and **Dashboard** are the same idea as web: public marketing shell vs logged-in app shell. **Sheets** are like web login/register/settings **modals**: they slide over whatever is underneath (marketing or dashboard).

### `routes.ts` — names, not extra navigators

| Export | Meaning | Web analogy |
|--------|---------|-------------|
| `rootRoutes` | Top stack branches: `Marketing`, `Dashboard` | Choosing marketing layout vs `/dashboard/*` |
| `mobileRoutes.public` | Drawer screen names under marketing (`PublicHome`, …) plus **route ids** for login/register sheets | `/`, `/pricing`, `/contact`; login/register are overlays, not drawer pages |
| `mobileRoutes.sheet` | Route ids for menu sheets (`SheetSettings`, `SheetAccount`) | Settings / account dropdown modals |
| `mobileRoutes.dashboard` | Drawer screen names under dashboard | `/dashboard/overview`, `/dashboard/projects`, … |

Login and register live under `public` in the file for **product** naming (auth), but they are registered on the **root stack** as form sheets, not inside the marketing drawer.

### How to navigate (cheat sheet)

| Goal | API | Example |
|------|-----|---------|
| Change page **inside the open drawer** (marketing or dashboard) | `navigation.navigate(...)` from that screen or drawer | `navigation.navigate(mobileRoutes.public.pricing)` |
| Open **login / register / settings / account** sheet | `openRootSheet(...)` in `rootNavigation.ts` | `openRootSheet(mobileRoutes.public.login)` |
| Switch to **dashboard** (admin) | `navigateToDashboard()` | Account sheet → Dashboard |
| **Create story** (logged in) | `navigateToCreateStory()` | Marketing app bar / drawer |
| **My profile** (logged in) | `navigateToMyProfile()` | Account sheet → Profile |
| Open a story from library | `navigateToViewStory(slug)` | Library list tap |
| Go to **marketing home** from dashboard | `navigateToMarketingHome()` | Logo in dashboard drawer |
| After **login** / **logout** reset the tree | `resetAfterLogin(user)` / `resetToMarketingAfterLogout()` | Login/Register screens, account sheet logout |

Helpers use `rootNavigationRef` on `NavigationContainer` so you do not walk `navigation.getParent()` from nested drawers.

### Key files

| File | Role |
|------|------|
| `application/App.tsx` | Providers + `NavigationContainer` + `ref={rootNavigationRef}` (parity with `web/…/application/App.tsx`) |
| `application/AppContent.tsx` | Root stack + sheet group (same role as `web/…/AppContent.tsx`) |
| `application/navigation/MarketingDrawerNavigator.tsx` | Public drawer |
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
eas env:create --environment production --name EXPO_PUBLIC_PROD_API_URL --value "https://api.metriz.ai"
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
