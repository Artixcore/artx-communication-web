# ARTX Web Foundation Verification - 2026-09-09

Branch: `codex/web-foundation-auth`

## Verified locally

- `npm run test:core`: **PASS**, 19 tests, 0 failures.
- Route policy keeps Freeways/public AID/research/project/UsWe/search/auth surfaces public while settings/account/security/messages/create/notifications and unknown routes fail closed as private.
- Prefix-confusion regression checks pass (`/freeways-malicious` and `/aid-malicious/*` remain private).
- Email validation accepts normal addresses at `artixcore.com`, Gmail, university/research and arbitrary custom domains without provider whitelisting; malformed input is rejected.
- AID handle validation is bounded.
- Safe API error normalization suppresses blank, oversized and hostile backend error strings and preserves only bounded stable metadata.
- Alert state is bounded to safe semantic types, 240-character messages and five recent alerts.
- Passkey UI is enabled only when browser support exists and the backend explicitly advertises enabled `auth.webauthn-v1`.
- Server API URL validation requires HTTPS outside loopback development and rejects embedded credentials.
- Security-header tests verify CSP has no wildcard script source, framing is denied, dangerous browser permissions are disabled and production HSTS is present.
- Source scan for `localStorage` / `sessionStorage`: **no credential-storage implementation found**.
- TypeScript/JSX syntax smoke check using local declaration stubs: **PASS**.

## Blocked / not claimed

Full Next.js dependency installation, framework type-check and production build are **BLOCKED in the current execution environment** because DNS/package-registry access to `registry.npmjs.org` fails with `EAI_AGAIN`.

Therefore this record does **not** claim:

- `npm install` or `npm ci` succeeded,
- `npm run typecheck` with real Next/React type packages succeeded,
- `npm run build` succeeded,
- browser-rendered visual QA succeeded.

These gates must run in a network-enabled controlled environment before the branch is eligible for merge/release.

## Security boundary

The proxy cookie check is an early navigation guard only. Private layouts call the Go backend `GET /v1/session` using the server-only session credential before rendering private pages. Backend per-resource authorization remains mandatory. Public pages contain no fabricated people, recommendations, counts, verification, presence or private user data.
