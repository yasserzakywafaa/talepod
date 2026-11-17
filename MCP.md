# MCP connector

AI tools (Claude, ChatGPT, the SwissLII MCP Gateway) connect to this API over MCP.
It comes from `@yasserzakywafaa/server-core` (`createBlogMcp`, one line in
`server/src/server.ts`) and is the same connector Hopover and aodit use.

## Scopes and tools

| Scope | Tools |
|---|---|
| read | `list_posts`, `get_post` |
| write | `create_post`, `update_post` |
| delete | `delete_post` |
| ga | `ga_traffic_summary`, `ga_top_pages`, `ga_traffic_sources`, `ga_key_events` (only when `GA4_PROPERTY_ID` and a Google key are set here) |
| gsc | `gsc_search_performance`, `gsc_top_queries`, `gsc_top_pages` (only when `GSC_SITE_URL` is set here) |
| pagespeed | `pagespeed_report` (only when a Google key or `PAGESPEED_API_KEY` is set here) |

Through the gateway, GA4, Search Console and PageSpeed are served by the gateway
itself (property and Google key set in the dashboard), so this server needs no
Google settings. The gateway sends the connection's scopes (`X-Mcp-Scopes`); a
direct connection with no header gets every tool.

Posts are saved in the `blogPosts` collection (separate from the stories in
`blogs`) and served read-only at `/api/v1/blog/posts`.

## Set up

1. Server env (Railway): `MCP_KEYS`, `MCP_SITE_NAME`, `MCP_SITE_ABOUT` (see `server/.env.example`).
2. SwissLII dashboard → Products → Talepod → Blog tools: paste `https://api.talepod.com/mcp/<key>` once.
3. Give each AI connection the talepod_* tools it needs.

Direct connection also works (the link works like a password):
`claude mcp add --transport http talepod https://api.talepod.com/mcp/<key>`

## Web pages

`/:locale/blog` and `/:locale/blog/:slug` come from client-core (`createBlogPages`).
The app's only file is `web/src/Pages/Articles/index.tsx` (API and site URLs, page shell,
call to action); its text is under `blog` in `web/src/i18n/locales/*/page.json`.
Each build prerenders published posts and adds them to the sitemap
(`web/vite.config.ts`). Set `VERCEL_DEPLOY_HOOK_URL` on the server so a new post
triggers a rebuild.

## Protection

- Unknown or missing key → 401. Remove it from `MCP_KEYS` to revoke.
- 300 requests per 15 minutes per key; `MCP_DAILY_POSTS` new posts per key per 24 hours.
