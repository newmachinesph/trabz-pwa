# Trabz PWA

Trabz is a jobs and gigs platform for blue-collar workers in the Philippines. This repo is the worker-facing progressive web app: workers browse and apply for jobs, claim short gigs, message employers, take courses and track their wallet. It is a mobile-first Next.js app that talks to the Trabz REST API. The employer and admin side lives in the separate `trabz-portal` repo.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `@ducanh2912/next-pwa`, Vitest + Testing Library.

## Screens

| Route | Purpose |
|---|---|
| `/`, `/about` | Landing and about pages |
| `/login`, `/register` | Sign in with email or phone; registration with phone OTP calls |
| `/dashboard` | Worker overview |
| `/jobs`, `/gigs` | Browse and apply for jobs, claim gigs (readable without an account) |
| `/messages` | Conversations with employers |
| `/wallet` | Balance and transactions (sign-in required) |
| `/learning` | Course catalogue |
| `/profile` | Account details, password change, terms and privacy text (sign-in required) |

## How it works

- `lib/api.ts` is the single API client. It wraps `fetch`, attaches the bearer token from cookies, and refreshes the token on expiry. It exposes typed functions for auth, jobs, applications, gigs, messaging, courses, wallet, KayaScore assessments, job matching and OFW tools.
- `lib/auth-context.tsx` holds the signed-in user for client components.
- `proxy.ts` (Next.js proxy, formerly middleware) redirects based on the `access_token` cookie. `/profile` and `/wallet` require a token; `/dashboard`, `/jobs` and `/gigs` can be browsed as a guest; `/login` and `/register` are for signed-out users.
- The app is installable: `public/manifest.json` plus generated icons in `public/AppImages`. The service worker is generated at build time by next-pwa and is disabled in development.
- `next.config.ts` sets security headers, including a Content-Security-Policy whose `connect-src` allows `https://api.trabz.ph` and `http://localhost:8000`. If you point the app at another API origin, add it there.

## Local development

Requires Node 20+ and a running Trabz API (or the hosted one).

```bash
npm install
npm run dev        # next dev --turbo on http://localhost:3000
```

Optional `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.trabz.ph/api/v1
```

If unset, the client defaults to `https://api.trabz.ph/api/v1`. For a local API use `http://localhost:8000/api/v1`.

## Checks

```bash
npm run lint
npm test           # vitest run
npm run build
```

Tests live in `__tests__/` and cover the API client, auth context, registration flow, bottom navigation and the route proxy.

## Deployment

Built as a standard Next.js app (`npm run build`, `npm start`) and suitable for Vercel. Set `NEXT_PUBLIC_API_URL` in the host environment. PWA features need HTTPS.

## License

MIT. See [LICENSE](LICENSE).
