# TalePod

Full-stack bedtime stories platform: **web** (Vite + React), **server** (Node + MongoDB), and **mobile** (Expo React Native).

## Quick start

| App | Directory | Docs |
|-----|-----------|------|
| Web | `web/` | `yarn install && yarn start` |
| Server | `server/` | `yarn install && yarn start:watch` |
| Mobile | `mobile/` | See [mobile/README.md](mobile/README.md) |

Mobile uses JWT + `X-Client-Platform: mobile` against the same API as the web app (Google browser OAuth, phone OTP). Configure `mobile/.env` from `mobile/.env.example` (LAN IP for local dev).
