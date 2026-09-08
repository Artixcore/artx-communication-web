# ARTX Web Foundation and Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first secure Next.js ARTX web slice with truthful public discovery surfaces, fail-closed private routes, arbitrary-domain email validation, safe error/alert handling, and passkey capability gating.

**Architecture:** `artx-communication-web` is a presentation client over the Go backend. Public and private route/data contracts are separate. `proxy.ts` performs only an optimistic cookie-presence redirect; server components and the Go API remain authoritative. Passkey UI is enabled only when `auth.webauthn-v1` is explicitly advertised.

**Tech Stack:** Node.js 22+, Next.js 16.3.3 Active LTS, React 19.2.7, TypeScript 7.0.2, Zod 4.5.4, CSS variables, Node built-in test runner for dependency-light core regression tests.

**Spec:** `docs/superpowers/specs/2026-09-09-web-foundation-auth-design.md`

## Global Constraints

- Never store access tokens, refresh tokens, private keys or recovery material in `localStorage` or `sessionStorage`.
- Public DTOs must not contain private email, recovery, device/session, OAuth token, private workspace or unpublished draft fields.
- Public surfaces never invent posts, users, verification, online, recommendation or security state.
- Private routes fail closed when the `__Host-artx_session` session signal is absent; backend authorization remains authoritative.
- Accept valid emails from `artixcore.com`, Gmail, Outlook, educational/research and arbitrary custom domains; do not whitelist providers.
- Use Next.js `proxy.ts` rather than deprecated `middleware.ts`.
- No GitHub Actions.
- Keep UI calm, warm-neutral, professional and visibly related to the Android V200 design system.

---

### Task 1: Bootstrap the Next.js production foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`

**Interfaces:**
- Produces the production build/runtime configuration consumed by all later tasks.

- [ ] **Step 1: Add pinned runtime dependencies and scripts**

```json
{
  "name": "artx-communication-web",
  "private": true,
  "version": "0.1.0",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test:core": "node --experimental-strip-types --test src/core/**/*.test.ts"
  },
  "dependencies": {
    "next": "16.3.3",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "zod": "4.5.4"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "typescript": "7.0.2"
  }
}
```

- [ ] **Step 2: Configure strict TypeScript**

Use `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noEmit: true`, App Router JSX, and `@/* -> ./src/*` paths.

- [ ] **Step 3: Configure security headers**

`next.config.ts` must return headers for all routes including CSP with `default-src 'self'`, no wildcard script origin, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`; also `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`, `X-Frame-Options: DENY`, and production HSTS.

- [ ] **Step 4: Create root layout and ARTX global tokens**

Use CSS variables matching the warm Android V200 family (`#f1f0e8` background, `#f8f7f2` surface, `#141410` text, restrained graphite/terracotta accents), dark-mode equivalents, 48px minimum interactive target, and a typography/spacing system.

- [ ] **Step 5: Validate JSON/TypeScript syntax locally**

Run: `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package ok')"`
Expected: `package ok`.

---

### Task 2: Implement route privacy classification with TDD

**Files:**
- Create: `src/core/security/route-policy.test.ts`
- Create: `src/core/security/route-policy.ts`
- Create: `src/proxy.ts`

**Interfaces:**
- Produces: `classifyRoute(pathname): 'public' | 'private'` and `isPrivateRoute(pathname): boolean`.

- [ ] **Step 1: Write the failing route-policy test**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyRoute } from './route-policy.ts'

test('keeps discovery public and settings private', () => {
  assert.equal(classifyRoute('/freeways'), 'public')
  assert.equal(classifyRoute('/aid/shams'), 'public')
  assert.equal(classifyRoute('/research/quantum-auth'), 'public')
  assert.equal(classifyRoute('/settings/security'), 'private')
  assert.equal(classifyRoute('/account'), 'private')
  assert.equal(classifyRoute('/messages'), 'private')
})
```

- [ ] **Step 2: Run RED**

Run: `node --experimental-strip-types --test src/core/security/route-policy.test.ts`
Expected: FAIL because `route-policy.ts` does not exist.

- [ ] **Step 3: Implement exact prefix classification**

Public prefixes: `/`, `/freeways`, `/aid`, `/research`, `/projects`, `/uswe`, `/search`, `/login`, `/register`.
Private prefixes: `/home`, `/create`, `/messages`, `/notifications`, `/settings`, `/account`, `/security`, `/devices`, `/sessions`, `/integrations`.
Unknown application routes default to private.

- [ ] **Step 4: Run GREEN**

Run the same test and require PASS.

- [ ] **Step 5: Add `src/proxy.ts`**

For private routes only, check presence of `__Host-artx_session`. If missing, redirect to `/login?returnTo=<relative path>`. Never treat cookie presence as backend authorization.

---

### Task 3: Implement identity validation and safe API errors with TDD

**Files:**
- Create: `src/core/validation/identity.test.ts`
- Create: `src/core/validation/identity.ts`
- Create: `src/core/errors/api-error.test.ts`
- Create: `src/core/errors/api-error.ts`

**Interfaces:**
- Produces: `normalizeEmail`, `validateEmail`, `validateAidHandle`, `normalizeApiError`.

- [ ] **Step 1: Write failing email tests**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeEmail, validateEmail } from './identity.ts'

test('accepts Artixcore, Gmail and custom domains', () => {
  for (const email of ['person@artixcore.com', 'person@gmail.com', 'researcher@university.edu', 'dev@my-company.dev']) {
    assert.equal(validateEmail(email).ok, true, email)
  }
})

test('normalizes case and whitespace but rejects malformed input', () => {
  assert.equal(normalizeEmail('  Person@ARTIXCORE.COM '), 'person@artixcore.com')
  assert.equal(validateEmail('not-an-email').ok, false)
  assert.equal(validateEmail('a@').ok, false)
})
```

- [ ] **Step 2: Run RED** and confirm missing module failure.

- [ ] **Step 3: Implement bounded RFC-conscious validation**

Trim/lowercase email, max 254 characters, local part max 64, require one `@`, nonempty labels, no leading/trailing dot/hyphen in labels, total domain bounds. Do not whitelist domains.

- [ ] **Step 4: Add safe API error tests**

Assert blank/hostile/oversized raw messages are replaced by `Something went wrong. Please try again.`; stable `code`, `retryable`, bounded `requestId` and field errors are preserved only after type/length validation.

- [ ] **Step 5: Implement and run GREEN** for both test files.

---

### Task 4: Implement alert state and passkey capability gating with TDD

**Files:**
- Create: `src/core/alerts/alert-state.test.ts`
- Create: `src/core/alerts/alert-state.ts`
- Create: `src/core/auth/passkey-capability.test.ts`
- Create: `src/core/auth/passkey-capability.ts`
- Create: `src/components/alerts/alert-region.tsx`

**Interfaces:**
- Produces safe, bounded alert models and `canUsePasskey(capabilities, browserSupported)`.

- [ ] **Step 1: Test alert bounding and semantic kinds**

Reject unknown kinds; trim messages; cap user-visible message at 240 characters; cap queue at five most-recent alerts.

- [ ] **Step 2: Run RED, implement, run GREEN**.

- [ ] **Step 3: Test passkey gating**

Passkeys return true only when browser support is true and an enabled capability named exactly `auth.webauthn-v1` exists.

- [ ] **Step 4: Run RED, implement, run GREEN**.

- [ ] **Step 5: Build `AlertRegion`**

Use `role=status` for success/info and `role=alert` for warning/error, no raw exception rendering, calm compact styling.

---

### Task 5: Build public ARTX surfaces without fake data

**Files:**
- Create: `src/components/shell/public-shell.tsx`
- Create: `src/components/shell/path-rail.tsx`
- Create: `src/components/shell/context-rail.tsx`
- Create: `src/components/states/truthful-empty-state.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/freeways/page.tsx`
- Create: `src/app/aid/[handle]/page.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/app/register/page.tsx`

**Interfaces:**
- Public pages render only static product framing and truthful capability-unavailable/empty states until public APIs exist.

- [ ] **Step 1: Build the three-surface shell** with no decorative dashboard clutter.
- [ ] **Step 2: Build Freeways** with categories (Knowledge, Research, People, Projects, Problems, UsWe, Agents) but no fabricated counts/content.
- [ ] **Step 3: Build public AID route** with handle validation and a safe `Public profile data is not available yet` state rather than fake person data.
- [ ] **Step 4: Build login/register forms** accepting arbitrary valid email domains and explaining passkey-first authentication. Submit controls remain disabled/unavailable until server WebAuthn capability wiring exists.

---

### Task 6: Build private settings shell and fail-closed edit surfaces

**Files:**
- Create: `src/components/shell/private-shell.tsx`
- Create: `src/app/(private)/home/page.tsx`
- Create: `src/app/(private)/settings/page.tsx`
- Create: `src/app/(private)/settings/security/page.tsx`
- Create: `src/app/(private)/account/page.tsx`
- Create: `src/app/(private)/aid/edit/page.tsx`

**Interfaces:**
- Produces authenticated-only shell surfaces. No private data is embedded in static/public page modules.

- [ ] **Step 1:** Build private shell with explicit `Private workspace` status and no fake account values.
- [ ] **Step 2:** Add Settings, Security, Account and Edit AID pages as private routes with safe unavailable states until APIs exist.
- [ ] **Step 3:** Ensure public navigation never exposes private payloads; links may exist, data may not.

---

### Task 7: Verification and handoff

**Files:**
- Modify only if verification exposes defects.

- [ ] **Step 1: Run all dependency-light core tests**

`node --experimental-strip-types --test src/core/**/*.test.ts`

Expected: all PASS.

- [ ] **Step 2: Run dependency installation/build if registry access exists**

`npm ci || npm install`
`npm run typecheck`
`npm run build`

If package registry access is unavailable, mark typecheck/build dependency resolution as BLOCKED, not passed.

- [ ] **Step 3: Scan source for token-storage regressions**

`grep -R "localStorage\|sessionStorage" src || true`

Expected: no credential-storage implementation.

- [ ] **Step 4: Commit branch and open a draft PR** with exact verification state.
