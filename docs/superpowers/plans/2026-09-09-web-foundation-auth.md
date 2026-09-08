# ARTX Web Foundation and Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first secure Next.js ARTX web slice with truthful public discovery surfaces, fail-closed private routes, arbitrary-domain email validation, safe error/alert handling, and passkey capability gating.

**Architecture:** `artx-communication-web` is a presentation client over the Go backend. Public and private route/data contracts are separate. `proxy.ts` performs an early cookie-presence redirect only; the private server layout revalidates the credential against `GET /v1/session`, and the Go API remains authoritative for every resource. Passkey UI becomes usable only when a reviewed backend capability named exactly `auth.webauthn-v1` is enabled.

**Tech Stack:** Node.js 22+, Next.js 16.3.3 Active LTS, React 19.2.7, TypeScript 7.0.2, CSS variables, dependency-light validation helpers, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-09-web-foundation-auth-design.md`

## Global Constraints

- Never store access tokens, refresh tokens, private keys or recovery material in `localStorage` or `sessionStorage`.
- Public DTOs must not contain private email, recovery, device/session, OAuth-token, private-workspace or unpublished-draft fields.
- Public surfaces never invent posts, users, verification, online, recommendation, count or security state.
- Private routes fail closed when the `__Host-artx_session` signal is absent or backend session validation fails.
- Accept ordinary valid emails from `artixcore.com`, Gmail, Outlook, educational/research and arbitrary custom domains; do not whitelist providers.
- Use Next.js `proxy.ts`, not deprecated `middleware.ts`.
- No GitHub Actions.
- Keep UI calm, warm-neutral, professional and visibly related to Android V200.
- Unknown application routes default to private.
- Full framework build is a merge gate; a blocked build is never reported as passed.

---

### Task 1: Secure Next.js foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/core/security/security-headers.ts`
- Test: `src/core/security/security-headers.test.ts`

**Interfaces:**
- Produces the pinned runtime and shared ARTX design/security baseline.

- [x] Pin `next@16.3.3`, `react@19.2.7`, `react-dom@19.2.7`, TypeScript 7.0.2 and Node >=22.
- [x] Enable strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- [x] Add CSP, framing protection, `nosniff`, Referrer-Policy, Permissions-Policy and production HSTS.
- [x] Use Android-V200-derived warm neutral design tokens, dark mode, 48px minimum targets and reduced-motion support.
- [x] Verify the security-header contract with dependency-light tests.

### Task 2: Public/private route policy

**Files:**
- Create: `src/core/security/route-policy.ts`
- Test: `src/core/security/route-policy.test.ts`
- Create: `src/proxy.ts`

**Interfaces:**
- Produces `classifyRoute(pathname): 'public' | 'private'` and `isPrivateRoute(pathname): boolean`.

- [x] RED: route-policy test fails before implementation exists.
- [x] GREEN: `/freeways`, `/aid/*`, `/research/*`, `/projects/*`, `/uswe/*`, `/search`, `/login`, `/register` are public.
- [x] GREEN: `/home`, `/create/*`, `/messages`, `/notifications`, `/settings/*`, `/account/*`, `/security/*`, `/devices/*`, `/sessions/*`, `/integrations/*` are private.
- [x] Unknown routes fail closed as private.
- [x] Prefix-confusion paths such as `/freeways-malicious` remain private.
- [x] `proxy.ts` redirects unauthenticated private navigation to `/login` without treating cookie presence as authorization.

### Task 3: Server-validated private session boundary

**Files:**
- Create: `src/core/config/server-env.ts`
- Test: `src/core/config/server-env.test.ts`
- Create: `src/core/auth/server-session.ts`
- Create: `src/app/(private)/layout.tsx`

**Interfaces:**
- `parseApiBaseUrl(raw, environment)` accepts HTTPS and development loopback HTTP only.
- `hasValidServerSession()` revalidates `__Host-artx_session` with the Go `GET /v1/session` endpoint.

- [x] Reject malformed API URLs, embedded credentials and production HTTP.
- [x] Allow loopback HTTP only during development.
- [x] Bound the server-only session credential before forwarding it.
- [x] Fail closed on missing config, missing cookie, timeout, network error or non-successful backend session response.
- [x] Redirect private layouts to login before private content renders when backend validation fails.

### Task 4: Identity validation, safe errors and alerts

**Files:**
- Create: `src/core/validation/identity.ts`
- Test: `src/core/validation/identity.test.ts`
- Create: `src/core/errors/api-error.ts`
- Test: `src/core/errors/api-error.test.ts`
- Create: `src/core/alerts/alert-state.ts`
- Test: `src/core/alerts/alert-state.test.ts`
- Create: `src/components/alerts/alert-region.tsx`

**Interfaces:**
- Produces `normalizeEmail`, `validateEmail`, `validateAidHandle`, `normalizeApiError`, `makeAlert`, `enqueueAlert`.

- [x] RED then GREEN email tests accept `person@artixcore.com`, Gmail, university and arbitrary normal custom domains without provider whitelisting.
- [x] Reject empty, malformed, overlong and invalid-domain inputs.
- [x] Bound AID handles to the approved lowercase identifier format.
- [x] Replace blank, overlong or hostile raw backend messages with safe fallback copy.
- [x] Preserve only bounded stable error code, request ID, retryability and field-error metadata.
- [x] Limit alerts to approved semantic kinds, 240 characters and the five most recent entries.
- [x] Use accessible `status` / `alert` roles instead of unbounded toast spam.

### Task 5: Passkey capability truthfulness

**Files:**
- Create: `src/core/auth/passkey-capability.ts`
- Test: `src/core/auth/passkey-capability.test.ts`
- Create: `src/core/api/capabilities.ts`
- Create: `src/components/auth/auth-email-form.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/app/register/page.tsx`

**Interfaces:**
- `canUsePasskey(capabilities, browserSupported)` returns true only for enabled exact `auth.webauthn-v1` plus browser support.

- [x] RED then GREEN capability-gating tests.
- [x] Fetch public backend capabilities server-side with no-store and bounded timeout.
- [x] Accept Artixcore, Gmail, Outlook, education/research and custom-domain email input.
- [x] Never simulate login when WebAuthn backend capability is missing.
- [x] Never silently enable password fallback.
- [x] When WebAuthn client ceremony is not implemented, explicitly state that no credentials were sent.

### Task 6: Calm public ARTX surfaces

**Files:**
- Create: `src/components/shell/path-rail.tsx`
- Create: `src/components/shell/context-rail.tsx`
- Create: `src/components/shell/public-shell.tsx`
- Create: `src/components/states/truthful-empty-state.tsx`
- Create: `src/components/states/public-domain-placeholder.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/freeways/page.tsx`
- Create: `src/app/aid/[handle]/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/app/research/[slug]/page.tsx`
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/app/uswe/[slug]/page.tsx`

**Interfaces:**
- Public pages render only public product framing and truthful empty/unavailable state until production APIs exist.

- [x] Implement Path Rail + Primary Surface + Context Rail on wide screens and a simplified mobile composition.
- [x] Keep Freeways public with Knowledge, Research, People, Projects, Problems, UsWe and Agents categories.
- [x] Validate AID handles before presenting the public profile shell.
- [x] Do not fabricate biography, skills, repositories, reputation, verification, counts, activity or recommendations.
- [x] Public research/project/UsWe placeholders state explicitly that private workspace data is never exposed as placeholder content.

### Task 7: Private owner surfaces

**Files:**
- Create: `src/components/shell/private-shell.tsx`
- Create: `src/app/(private)/home/page.tsx`
- Create: `src/app/(private)/settings/page.tsx`
- Create: `src/app/(private)/settings/security/page.tsx`
- Create: `src/app/(private)/account/page.tsx`
- Create: `src/app/(private)/aid/edit/page.tsx`
- Create: `src/app/(private)/create/page.tsx`
- Create: `src/app/(private)/messages/page.tsx`
- Create: `src/app/(private)/notifications/page.tsx`
- Create: `src/core/navigation/navigation-model.ts`
- Test: `src/core/navigation/navigation-model.test.ts`

**Interfaces:**
- Public navigation and private navigation are separate immutable models.

- [x] Keep Settings, Account, Security and Edit AID private by route and navigation model.
- [x] Keep Home/Create/Messages/Notifications behind backend-confirmed session validation.
- [x] Render no fake account, session, device, message or notification state while APIs are unconnected.
- [x] Preserve the existing E2EE boundary for future web messaging.

### Task 8: Verification and handoff

**Files:**
- Create: `docs/verification/2026-09-09-web-foundation-auth.md`

- [x] Run `npm run test:core` -> 19 tests PASS, 0 fail.
- [x] Scan `src` for `localStorage` / `sessionStorage` -> no credential-storage implementation found.
- [x] Run TypeScript/JSX syntax smoke check with local declaration stubs -> PASS.
- [ ] Run `npm install`/`npm ci` in a network-enabled environment.
- [ ] Run `npm run typecheck` with actual Next/React packages.
- [ ] Run `npm run build`.
- [ ] Perform browser-rendered responsive/accessibility visual QA.

The four unchecked gates are currently **BLOCKED by npm registry DNS/network access in the execution environment**, not reported as passed. They remain mandatory before merge/release.
