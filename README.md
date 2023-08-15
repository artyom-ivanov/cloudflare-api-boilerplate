# Cloudflare Workers API Boilerplate

Simple API with routing based on:

- Cloudflare Workers
- Itty-router
- Supabase
- Firebase Auth (using for check JWT-tokens)
- Telegram channel notifications

I got tired of doing it again every time, so I made this template. There is already CORS processing, basic routing, simple work with supabase, and so on.

### Config

- Fill all the stuff in `./src/config/index.ts`
- Fix Supabase project ID in `package.json`
- Fill `wrangler.toml`
