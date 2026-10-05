# geleus.io — refactor plan

Status: **planning** (2026-10-05). The résumé moved to https://geleus.com/#resume; the root of
this domain currently redirects there and is otherwise free. This document is the plan for
turning geleus.io into the engineering side of geleus (geleus.com stays the public/product side).
Hosting is not tied to GitHub Pages — each piece below names where it should live.

## Decision: start with `api.geleus.io` + a personal dashboard

The first two pieces, built together:

1. **`api.geleus.io`** — one Cloudflare Worker, one repo, `wrangler deploy`. Routes:
   - `GET /status` — what the dashboard reads (JSON: per-service `ok`, `latency`, `checkedAt`, `lastSeen`).
   - `POST /ping/<service>` — heartbeats pushed by things that aren't public URLs (daemons, cron jobs, Actions).
   - `POST /hook/<name>` — webhook receivers (GitHub deploys, Shopify test events, …); appended to a short ring buffer.
   - later `GET /r/<slug>` — short links (real 302s, which Pages can't do).
   State in **KV**; a **cron trigger** every 5 min runs the pull checks.
2. **Dashboard at `https://geleus.io/`** — static page in this repo (GitHub Pages), same design
   language as geleus.com (charcoal / moss, JetBrains Mono, viewfinder HUD; reuse `geo.js` +
   `cluster.js` from pidoshva.github.io as the background). Fetches `api.geleus.io/status`, no build step.

### How tracking works (no manual upkeep)
- **Pull checks** (Worker cron): hit each public URL — geleus.com, vacaish, geleus.io/countdown,
  the weekly-summary workflow's last run (GitHub API) — and store `{ok, latency, checkedAt}`.
- **Push heartbeats**: non-public things call `/ping/<service>` on a schedule (launchd/cron/Action
  step). Stale heartbeat → amber, then red on the board.
- **Events**: `/hook/*` payloads become a "recent activity" column (deploys, orders, bot events).

### Settle early
- **Privacy**: public-site uptime can be public; heartbeats from personal machines reveal presence.
  Put the dashboard behind **Cloudflare Access** (GitHub login) from day one, or at minimum require
  a token on `/status` and keep the page unlisted.
- **Scope**: first version tracks 5–6 things, then grows. Candidate list (to confirm):
  geleus.com · vacaish · geleus.io/countdown · weekly-summary workflow · claude-micro daemon · home Pi · Supabase project.

### Prerequisites / open questions
- [ ] geleus.io DNS moved to **Cloudflare** (needed for Workers on the subdomain, cron, KV, Access).
      Where is DNS today? Cloudflare account exists?
- [ ] Final list of services to track.
- [ ] Public or behind a login (recommendation: Access).

### Build steps (once the above is answered)
1. Cloudflare zone for geleus.io; keep the apex on GitHub Pages (CNAME flattening) and add `api` as a Worker route.
2. Worker repo (`geleus-api`): routes above, KV namespace, cron, a shared `PING_TOKEN` secret for heartbeats.
3. Heartbeat snippets: launchd plist for claude-micro, cron line for the Pi, a step in `weekly-summary.yml`.
4. Dashboard page in this repo: service cards with status dot + latency sparkline, activity column,
   last-updated stamp; mobile layout; reads `/status` with the Access cookie.
5. Access policy (GitHub login, allow-list of one).

## Later ideas (backlog, in rough priority)
- **Tunnels to own machines**: `home.` / `pi.` via Tailscale Funnel or Cloudflare Tunnel; a fixed `dev.`
  subdomain for local dev servers (stable URL for Shopify/OAuth webhooks and mobile testing).
- **Personal MCP server** at `mcp.` so Claude Code / claude.ai can call personal tools from anywhere.
- **Bot endpoints** (Telegram/Slack) as more `/hook/*` routes.
- **Previews/staging**: `preview.` on Vercel or Cloudflare Pages for branch deploys of vacaish, Grow, client work.
- **`status.`** as a standalone public status page (Upptime) if the dashboard stays private.
- **`docs.`** rendered READMEs/ADRs for the open-source repos; **`lab.`** for experiments and exported artifacts;
  **`pkg.`** static npm/pip index or Homebrew tap (`brew install geleus/tap/gifify`).
- **A small VPS** (`box.`) with Docker Compose — Postgres/Redis/Kafka for end-to-end NestJS testing, Coolify/Dokku for push-to-deploy.
- **`vault.`** self-hosted secrets (Bitwarden/Infisical) shared between machines and Actions.
- **Identity**: `.well-known` (passkeys, Keybase, Matrix), `security.txt`; mail `@geleus.io` via Fastmail or Cloudflare Email Routing.

## Non-goals
- Moving the résumé back here (it lives in pidoshva.github.io as `/#resume`).
- Touching `countdown/` (separate PWA, keeps working at geleus.io/countdown/).
