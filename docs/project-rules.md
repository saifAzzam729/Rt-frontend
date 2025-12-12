---
title: RT SYR Project Rules
lastUpdated: 2025-11-24
---

## 1. Architecture & Code Quality

- Build features with Next.js 16 App Router patterns: server components stay async/data-focused, client components are reserved for interactivity.
- Favor strongly typed code; avoid `any` and rule suppressions unless documented.
- Reuse primitives in `components/` and shared hooks before pulling new UI libraries or duplicating logic.
- Capture notable architecture decisions in PR descriptions and follow-up ADR notes when they affect multiple modules.

## 2. Localization & Content Management

- Every user-facing string ships in English and Arabic with RTL verification. Add translation keys to the shared i18n resources before merge.
- Do not hardcode UI copy; route through localization helpers/components.
- When updating marketing/About content, reflect the change in both locales and update the relevant checklist in `docs/client-requirements-todo.md`.

## 3. Data, Security & Compliance

- Keep Supabase credentials out of the repo; use env vars and server helpers in `lib/supabase/`.
- Schema or API changes must be mirrored in timestamped files under `supabase/migrations` and include RLS policy reviews so least privilege holds.
- Enforce agreed password policy and MFA/OTP flows. Document any security exceptions for review.
- Validate uploads (license files, attachments) for type/size and set appropriate storage ACLs.

## 4. Workflow, Reviews & Testing

- Run `npm run lint` (or `bun lint`) plus targeted tests before pushing. Attach manual QA notes/screenshots for UI work.
- Keep PRs focused; reference and update matching checklist items in `docs/client-requirements-todo.md`.
- Use descriptive commits (`feat`, `fix`, `chore`, etc.) and include migration steps when needed.
- Leverage existing GitHub templates; propose updates when workflows change.
- Apply database changes through the Supabase CLI (`bun run db:bootstrap`, `bun run db:migrate`) and keep SQL mirrored in `supabase/migrations`.

## 5. UX & Accessibility

- Maintain WCAG AA contrast. Verify keyboard navigation and ARIA labels for interactive components.
- Follow Shadcn component conventions for consistency; document rationale if diverging.
- Ensure dialogs, banners, and notices are dismissible and restore focus correctly.

## 6. Deployment & Monitoring

- Default feature flags/env toggles to safe/off in production.
- After deploys, monitor Supabase + Vercel logs for at least 30 minutes and report anomalies in the ops channel.
- Maintain incident notes/post-mortems so future contributors understand context and mitigation steps.
