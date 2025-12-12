# Client Requirements Todo

Track the 16 client requests as actionable todo lists with contextual checkpoints.

## 1. Bilingual Arabic & English Experience

- [x] Select i18n framework for Next.js (e.g., `next-intl`) and bootstrap Arabic locale.
- [x] Inventory all user-facing copy and provide EN/AR translations, including marketing content.
- [x] Update routing/navigation to support locale switching (language toggle, locale-aware URLs).
- [x] Verify RTL layout adjustments, typography, and QA with bilingual reviewers.

## 2. Free-Post Quota Messaging for Organizations

- [x] Surface live quota widgets on job and tender posting flows (2 free jobs + 2 free tenders).
- [x] Block new submissions once the complimentary quota is used up and prompt users to contact support.
- [x] Communicate the total free allocation (4 posts) wherever organizations initiate a new posting.
- [x] Enforce Supabase triggers/views (`supabase/migrations/20250220165300_backend_free_post_limits.sql`) so limits are upheld server-side.

## 3. Organization Registration Requirements

- [x] Update registration form to capture license number, upload license copy, and multi-select work sectors.
- [x] Add UI + backend to invite a secondary account tied to the same organization.
- [x] Provide guidance on “what the organization sees” (permissions summary) post-registration.
- [x] Enforce completion of these fields before allowing organization features.

## 4. Tender Posts Without Budget

- [x] Remove budget fields from tender form UI and validation schema.
- [x] Hide existing budget data across listings and detail pages.
- [x] Communicate the change directly in the tender form helper text.

## 5. Draft Auto-Publish with Announcement Date

- [ ] Add required “announcement date” field to tender model/form when status is draft.
- [ ] Implement scheduler (Supabase cron/Edge Function) or server task to publish drafts on announcement date.
- [ ] Display upcoming publish date in dashboard and send confirmation to org.

## 6. “Post New Tender” CTA Consistency

- [x] Ensure CTA routes to tender form only, not job form.
- [x] Update copy/iconography to clarify it is specifically for tenders.
- [x] Regression-test job posting flow to confirm no collisions.

## 7. Public Sections Accessible Without Login

- [x] Review navigation/guard logic so “Work”, “Tenders”, “About Us” render publicly.
- [x] Keep posts (details/apply actions) gated behind auth as required by RLS.
- [x] Smoke-test middleware to avoid redirect loops for anonymous users.
- [x] Auto-create missing user profiles post-login to prevent redirect loops for newly approved accounts.

## 8. Statistics Should Start at Zero

- [x] Initialize dashboard metric widgets with zero baseline while data loads.
- [x] Guard Supabase results to coalesce null/undefined into 0.
- [x] Confirm charts and animations handle zero state without flicker.

## 9. Browse Dropdown for Jobs vs Tenders

- [x] Design dropdown control (desktop + mobile) allowing users to toggle data source.
- [x] Wire dropdown to combined CTA that routes to job or tender browsing instantly.
- [x] Update metadata/hero copy to mention browsing both jobs and tenders.

## 10. Add “Syria” to About Us

- [x] Update About Us content blocks (both locales) to explicitly mention Syria.
- [x] Ensure change propagates to marketing snippets and metadata.

## 11. “How the Website Works” Info Bar

- [x] Draft concise multi-step message (English + Arabic).
- [x] Implement reusable info bar component on landing and Work pages.
- [x] Localize content for Arabic/English within the component.

## 12. Fee Disclaimer Notice

- [x] Add prominent notice (“We do not charge any fees… report suspicious activity”) on relevant pages.
- [x] Link notice to contact/report page for easy escalation.

## 13. SEO Hashtags / Metadata

- [x] Research keyword/hashtag list for recruitment + tenders in Syria.
- [x] Update `Metadata` (Next.js) for core pages and add hashtags in hero/marketing copy as needed.

## 14. “Report This Ad” Option

- [x] Add CTA on tender/job details to report empty or suspicious ads.
- [x] Create report form storing entries or instructions in Supabase/report page with link validation.
- [x] Build admin/support escalation flow via fee disclaimer + /report page.

## 15. Password Policy & MFA

- [x] Define password requirements (length, case, number, symbol) and enforce before account creation.
- [x] Update signup/login UI to display policy and validation errors.
- [x] Add email OTP step on every password login and document the verification flow.

## 16. Manual Approval Before Posting

- [x] Introduce `approved` flag on organizations/companies and default to pending (enforced via RLS).
- [x] Build admin workflow to review submissions (Admin dashboard → pending lists) and approve accounts.
- [x] Block posting actions until approval with UI notices + Supabase RLS, and show pending alerts to users.
