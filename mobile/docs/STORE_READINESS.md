# Shipping TalePod to the App Store and Play Store

Everything that has to be true before a submission, and who has to do it.
Items marked **code** are done in this repo; items marked **you** need an
account, a console, or an asset that cannot live in git.

---

## 1. Versioning — how the three numbers relate

There are three separate numbers and they are easy to confuse:

| Number | Where it lives | Who bumps it |
| --- | --- | --- |
| `version` (e.g. `1.0.0`) | `app.config.ts` | You, by hand, per release |
| `buildNumber` / `versionCode` | EAS servers | `autoIncrement` in `eas.json`, per build |
| `runtimeVersion` | Derived from `version` | Follows `version` automatically |

`eas.json` sets `appVersionSource: "remote"`, which governs **only** the
build number. The marketing `version` stays in `app.config.ts`.

The consequence worth internalising: `runtimeVersion` uses the `appVersion`
policy, so **bumping `version` starts a new OTA runtime**. Installs on the
old version stop receiving `eas update` pushes and only catch up through a
store release. Bump `version` when you ship native changes; leave it alone
when you are pushing JS-only updates.

---

## 2. Store accounts and identifiers — **you**

- [ ] Apple Developer Program membership, active ($99/yr)
- [ ] Google Play Developer account ($25 one-off)
- [ ] App record created in App Store Connect → gives you the `ascAppId`
- [ ] App record created in Play Console
- [ ] Fill in the placeholders in `eas.json` → `submit.production.ios`
      (`$APPLE_ID`, `$ASC_APP_ID`, `$APPLE_TEAM_ID` — set them as EAS
      environment variables rather than committing them)
- [ ] Play service account JSON downloaded to
      `mobile/google-play-service-account.json` (gitignored)

Bundle identifiers are already set and must not change after the first
submission: `com.talepod.app` on both platforms.

---

## 3. Privacy and data disclosure — **you**

This is where most first submissions stall. The app collects:

| Data | Why | Linked to identity |
| --- | --- | --- |
| Email address | Account (Google sign-in) | Yes |
| Phone number | Account (OTP sign-in) | Yes |
| User content (stories, avatars, child's name and age) | Core feature | Yes |
| Purchase history | Subscriptions | Yes |
| Crash data | Sentry | No — only an opaque user id is sent |

- [ ] **App Store Connect → App Privacy** answered to match the table above
- [ ] **Play Console → Data safety** form answered to match
- [ ] Privacy policy hosted at a **public URL** and entered in both consoles.
      The in-app `PrivacyPolicyScreen` does not satisfy this — both stores
      want a URL they can open in a browser.
- [ ] Terms URL, same requirement

### Children's privacy — read this before submitting

The app generates bedtime stories using a child's name, age and gender.
That places it near COPPA (US) and the Play **Families** policy even if you
do not market it to children.

- [ ] Decide and record: is the *user* a parent, or a child? The app's sign-up
      flow (phone/Google, subscriptions) implies parent-operated. Say so in
      the listing and keep the age rating consistent with it.
- [ ] Play Console → **Target audience and content**: if you declare any age
      band under 13, the Families policy applies and brings requirements this
      checklist does not cover. If the target is adults who create stories
      *for* children, declare 18+ and keep the store listing consistent.
- [ ] App Store age rating questionnaire — answer honestly about
      user-generated content and unrestricted web access.

---

## 4. Content moderation — **you**, with a code dependency

Both stores require a moderation story for user-generated content. Today
`hasCensoredWords` runs **on the device only**, which is trivially bypassed
by anyone using the API directly.

- [ ] Move or duplicate the censored-word check server-side, in the story and
      avatar creation endpoints. Client-side filtering is a UX affordance,
      not a control.
- [ ] Be ready to describe the moderation process in the review notes.

---

## 5. Account deletion — Apple guideline 5.1.1(v) — **verify**

Apple rejects apps that create accounts but do not let users delete them
in-app. `DeleteAccountDialog` exists and is wired to
`END_POINTS.AUTH.DELETE_ACCOUNT`.

- [ ] Confirm it is reachable in a few taps from Profile without hunting
- [ ] Confirm the server actually deletes (or fully anonymises) the account
      and its stories, rather than flagging a row
- [ ] Note the path in the review notes so the reviewer finds it

---

## 6. Assets — **you**

- [ ] iPhone screenshots: 6.7" and 6.5" (App Store minimum)
- [ ] iPad screenshots — required because `supportsTablet: true` is set.
      Either produce them, or set it to `false` and ship iPhone-only.
- [ ] Play: phone screenshots, 1024×500 feature graphic, 512×512 icon
- [ ] Descriptions and keywords per supported locale (en, de, fr, ar)

---

## 7. Deep links — **you** (code side is done)

`src/application/navigation/linking.ts` and the `associatedDomains` /
`intentFilters` entries in `app.config.ts` are in place. They only take
effect once the web app serves the association files:

- [ ] `https://talepod.com/.well-known/apple-app-site-association`
      (JSON, **no** `.json` extension, served as `application/json`,
      no redirects) containing the `TEAMID.com.talepod.app` app ID
- [ ] `https://talepod.com/.well-known/assetlinks.json` containing the
      Play signing certificate's SHA-256 fingerprint
- [ ] Verify with `npx uri-scheme open https://talepod.com/story/some-slug --ios`

Until these are served, https links open the website and the custom
`talepod-app://` scheme still works — the correct fallback, not a bug.

---

## 8. Crash reporting — **you** (code side is done)

- [ ] Create the Sentry project, set `EXPO_PUBLIC_SENTRY_DSN` in the EAS
      `preview` and `production` environments
- [ ] Set `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` on EAS so
      the config plugin uploads source maps. Without them the plugin is not
      added at all (see `app.config.ts`) and production stack traces stay
      minified.
- [ ] Trigger a test crash from a preview build and confirm it arrives

---

## 9. Pre-submission smoke test

Run against a **production-profile build on real hardware** — not Expo Go,
which does not exercise the native modules that matter here.

- [ ] Cold start, no network → the app explains itself rather than hanging
- [ ] Sign in with Google, force-quit, reopen → still signed in
- [ ] Sign in with phone OTP → same
- [ ] Let the access token expire → the app returns to signed-out state
      instead of silently failing every request
- [ ] Create a story end to end, including the generation progress snackbar
- [ ] Open a shared story link from Messages, both warm and **cold** start
- [ ] Switch language to Arabic and walk the main screens (see the RTL
      caveat in `README.md`)
- [ ] Rotate to landscape on both a phone and a tablet
- [ ] Delete the account and confirm the session ends

---

## 10. First submission order

1. `eas build --profile production --platform all`
2. `eas submit --profile production --platform ios` → TestFlight
3. Internal testing on TestFlight and the Play internal track
4. Only then promote to review

Expect the first review to take longer and to ask about children's data and
AI-generated content. Answer both in the review notes up front.
