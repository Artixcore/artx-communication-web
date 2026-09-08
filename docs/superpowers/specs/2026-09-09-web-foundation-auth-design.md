# ARTX Web Foundation and Authentication Design

## Goal

Create the first production-grade ARTX web foundation using Next.js while preserving strict separation between public discovery data and authenticated/private user data.

## Architecture

The web app is a presentation client over `Artixcore/artx-communication-server`. The browser must never become an authorization authority. Public routes consume purpose-built public DTOs; authenticated/private routes require a server-established session and must still be authorized by the Go API. Route guards improve UX but never replace backend authorization.

## Supported identity inputs

Users may associate any syntactically valid email address, including `@artixcore.com`, Gmail, Outlook, educational, research, or custom business domains. The UI must not whitelist consumer providers. Email is an identity/contact factor, not a privileged authentication bypass.

Primary authentication direction is passkey/WebAuthn-first. Until the Go backend advertises a reviewed `auth.webauthn-v1` capability, the web client must present passkey authentication as unavailable rather than simulate successful login.

## Data classes

- `PUBLIC`: explicitly publishable data such as public AID profile fields, public Freeways items, public research, public projects and public UsWe data.
- `AUTHENTICATED`: data available to any signed-in account when domain policy allows it.
- `OWNER`: account/profile/settings data visible only to the owning account.
- `WORKSPACE_MEMBER`: private workspace data authorized by membership/role.
- `PRIVILEGED`: narrowly scoped administrative/operational data.
- `E2EE`: opaque encrypted communication data; plaintext is never exposed to server/public surfaces.

No public DTO may accidentally contain private email addresses, recovery data, device/session inventory, OAuth tokens, unpublished drafts, private connections, private workspace membership, or security settings.

## Route policy

Public routes include `/`, `/freeways`, `/aid/[handle]`, `/research/[slug]`, `/projects/[slug]`, `/uswe/[slug]`, `/search`, `/login`, and `/register`, but domain objects render only when the API marks them public.

Private routes include `/home`, `/create/*`, `/messages`, `/notifications`, `/settings/*`, `/account/*`, `/security/*`, `/devices/*`, `/sessions/*`, `/integrations/*`, and private workspace routes.

The web shell uses a calm three-surface composition on wide screens: Path Rail, Primary Surface, and Context Rail. Mobile collapses to the primary surface with contextual actions. It inherits the existing Android V200 visual family: warm neutral surfaces, disciplined typography, restrained accents, generous whitespace, accessible targets, and no clone-like social/SaaS dashboard styling.

## Session policy

- No access or refresh token in `localStorage` or `sessionStorage`.
- Production authentication uses Secure, HttpOnly, SameSite cookies issued/validated through server-side web auth endpoints or a trusted same-origin BFF boundary.
- Private route checks fail closed when session state is missing, invalid, expired, or indeterminate.
- Sensitive settings may require step-up authentication once the backend capability exists.

## Validation

Client validation improves UX; backend validation remains authoritative. Zod schemas validate email, handles, route params, form values, safe API errors and public DTOs. Inputs are trimmed and bounded. Unknown fields in security-sensitive DTOs are rejected where doing so prevents accidental data leakage.

## Error and alert policy

The client consumes stable backend error codes and never parses English messages for branching. Raw exceptions, stack traces, SQL errors, hostnames, tokens, signed URLs, keys or request bodies must never reach user-visible alerts.

Alerts use four restrained semantic classes: success, information, warning and error. Field validation stays adjacent to the field instead of producing toast storms. Unknown failures show safe copy plus a request ID when available.

## Security headers

The Next.js foundation sets a strict baseline for CSP, frame protection, `nosniff`, Referrer-Policy, Permissions-Policy and production HSTS. CSP may be tightened further as real external integrations are introduced. No wildcard script origins are permitted.

## Freeways and public profiles

The first implementation is structurally real but truthfully empty until production public APIs exist. It must not invent posts, users, connection states, verification states or recommendations. Empty/capability-unavailable states are first-class UI.

## Central Command

This slice reports its release/build/capability state to the ARTX Central Command workstream through coordination metadata first. Runtime Central Command integration remains read-only and requires the backend observability contract defined in the central-command issue.

## Definition of done

- Next.js Active LTS foundation builds successfully.
- Public/private route classification is unit tested.
- Private surfaces fail closed without a valid server session signal.
- Email validation accepts `@artixcore.com`, Gmail and arbitrary valid domains while rejecting malformed addresses.
- Safe API error normalization is tested for blank, oversized and hostile messages.
- Public Freeways/AID shells contain no fake data.
- Settings/edit surfaces are private by construction.
- Security headers are configured and tested where practical.
- Lint, type-check, unit tests and production build pass locally before the branch is presented for merge.
