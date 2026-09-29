# Reborn — Missing Product Features

This document enumerates **user-facing features** that are missing, stubbed, or only half-wired across the mobile app and the API/admin pieces those features depend on.

It is a product catalog, not a launch runbook. Infrastructure, store submission, security hardening, CI, and observability are in [Go to Production](../ops/GO-TO-PRODUCTION.md). Domain background is in [General Context](./GENERAL-CONTEXT.md).

---

## How to read this document

| Status | Meaning |
| --- | --- |
| **Missing** | No real implementation. Advertised in UI or in the business doc, or required by the product model. |
| **Stub** | UI exists but does nothing useful: Soon badge, empty `onPress`, alert-only, or fake data. |
| **Partial** | Works on one layer or platform only (for example API exists, mobile does not call it). |

Each item notes **where it is advertised**, **current evidence**, and **what is missing**.

---

## 1. Account and privacy

### 1.1 Delete account — Partial

- **Where advertised:** Settings → Delete account.
- **Evidence:** Mobile shows `Alert.alert("Delete account", "Coming soon!")` in `reborn-mobile-app-v2/components/settings/SettingsPortal.tsx`. API `DELETE /current-user` in `reborn-api/src/modules/users/controllers/current-user.controller.ts` already soft-deletes the user.
- **What is missing:** Wire the settings action to the API (confirm, re-auth, sign out). Define what happens to open jobs, chat, and balance.

### 1.2 Two-factor authentication — Stub

- **Where advertised:** Settings → Privacy & security → Two-factor authentication, with a “Soon” badge.
- **Evidence:** `reborn-mobile-app-v2/components/settings/privacy-security/PrivacySecurityPortal.tsx` — row has no `onPress`. No TOTP/SMS endpoints in the API.
- **What is missing:** Enrollment, challenge on login, recovery codes, and API support.

### 1.3 Data visibility controls — Stub

- **Where advertised:** Same privacy screen, “Soon” badge.
- **Evidence:** `PrivacySecurityPortal.tsx` — no handler.
- **What is missing:** User-controlled visibility beyond the existing public/private profile toggle (what followers, clients, or search can see).

### 1.4 Download your data — Stub

- **Where advertised:** Same privacy screen, “Soon” badge.
- **Evidence:** `PrivacySecurityPortal.tsx` — no handler. No export endpoint in the API.
- **What is missing:** An archive of profile, jobs, chat metadata, and finance summary the user can download.

### 1.5 About, Terms, and Privacy copy — Stub

- **Where advertised:** Settings legal/info screens.
- **Evidence:** `reborn-mobile-app-v2/components/settings/About.tsx`, `TermsAndConditions.tsx`, `PrivacyPolicy.tsx` — hardcoded English. About describes a community/discovery product (“feel at home in their communities”), not a gig marketplace. No public hosted URLs.
- **What is missing:** Marketplace-accurate, localized (en/fr/ar) copy, and pages that open without installing the app.

### 1.6 Email verification — Partial

- **Where advertised:** Route `/main/settings/verify-email` exists; can be triggered from a profile stat.
- **Evidence:** `reborn-mobile-app-v2/app/main/settings/verify-email.tsx`; API `send-verify-email` / `verify-email`.
- **What is missing:** A clear entry in the main settings list so users can find and complete verification.

---

## 2. Finance and payments

### 2.1 Real payment checkout — Missing

- **Where advertised:** Finance top-up “Pay Now”; ledger type `BOUGHT_VIA_CREDIT_CARD`.
- **Evidence:** `reborn-mobile-app-v2/components/finance/TopUp.tsx` posts an amount. `reborn-api/src/modules/finance/controllers/finance.controller.ts` calls `addFunds` with no payment-provider charge or webhook.
- **What is missing:** A PSP (or IAP, if required) that verifies payment server-side before crediting the wallet.

### 2.2 Payment methods — Stub

- **Where advertised:** Finance overview “Visa ending in 4242” and “Add new method”.
- **Evidence:** `reborn-mobile-app-v2/components/finance/FinanceOverviewTab.tsx` — hardcoded card, no `onPress` on Add Funds or method rows. Locale strings in `i18n/locales/*/finance.json`.
- **What is missing:** Real saved methods, add/remove flow, or removal of the mock UI if unused.

### 2.3 Job escrow / hold — Missing

- **Where advertised:** Job workflow copy mentions escrow; business doc implies payment through the job lifecycle.
- **Evidence:** `reborn-api` job-management services do not call finance to hold or capture funds. Workflow comments in `job.workflow.ts` are documentation only.
- **What is missing:** Reserve client funds when a candidate is accepted; release or refund on success/failure.

### 2.4 Worker payouts — Missing

- **Where advertised:** Workflow language (“Payout has been released”).
- **Evidence:** No payout request API or withdraw UI. Users can hold a balance they cannot cash out.
- **What is missing:** Withdrawal to bank/wallet, rules for held vs available balance, admin/audit trail.

### 2.5 Payment verified on jobs — Stub

- **Where advertised:** Job hero Verified / Unverified badge.
- **Evidence:** `reborn-api/src/modules/job-management/services/job.service.ts` always returns `paymentVerified: false`.
- **What is missing:** Badge bound to a real payment/hold record.

---

## 3. Jobs and reviews

### 3.1 Reviews and ratings — Missing

- **Where advertised:** Home Quick Action “Reviews” (disabled, “Soon”); social list shows a rating; job metadata includes `reviewCount` / `rating`; business doc job states include Worker/Client review.
- **Evidence:** `reborn-mobile-app-v2/components/home/QuickActions.tsx` — `onPress: () => {}`, `disabled: true`. `job.service.ts` hardcodes `reviewCount: 0`, `rating: 0`. `reborn-mobile-app-v2/components/profile/social/UserEntry.tsx` hardcodes `4.9 (127 reviews)`. No review submission API.
- **What is missing:** Submit and display reviews after a job, real aggregates, and a reviews screen.

### 3.2 Job execution lifecycle on mobile — Partial

- **Where advertised:** [GENERAL-CONTEXT.md](./GENERAL-CONTEXT.md) job state machine (Start, Finish, Hold, Choose/Accept/Refuse Candidate, reviews, Successful/Failed).
- **Evidence:** Mobile job management drives Post / Unpublish / Archive in `JobManagmentCard.tsx`. Events exist in `reborn-mobile-app-v2/types/job-management.ts` but are unused. Back office has a full workflow inspector.
- **What is missing:** Client and worker actions in the app to run a job from hire through completion.

### 3.3 Approve request vs Choose Candidate — Partial

- **Where advertised:** Approving a job request should start the contract / candidate-pending flow.
- **Evidence:** `reborn-api/src/modules/job-management/services/job-request.service.ts` sets `workerId` on approve and does not fire the job workflow `Choose Candidate` event.
- **What is missing:** One consistent path: request approval drives the job state machine (and later escrow).

### 3.4 Job pipeline and share actions — Stub

- **Where advertised:** Job management actions: Export, Broadcast, Interview, Copy link, Share social; card menu Share.
- **Evidence:** `reborn-mobile-app-v2/components/jobs/job-management/JobActions.tsx` — those items have titles and icons, no `onPress`. `JobManagmentCard.tsx` share uses `onPress: () => {}`.
- **What is missing:** Implement each action, or hide them until they work.

### 3.5 Map-based job discovery — Missing

- **Where advertised:** Business doc — location on jobs and map-based discovery.
- **Evidence:** Map pin exists on job create/edit (`MapPinField.tsx`). Explore filters (`useExploreFiltersFormStructure.tsx`) have categories, tags, skills, dates — no radius, map browse, or geo sort.
- **What is missing:** Explore map or distance filter using job coordinates.

### 3.6 Profile gallery / portfolio — Stub

- **Where advertised:** Profile gallery tab; business doc “portfolio uploads”.
- **Evidence:** `reborn-mobile-app-v2/components/profile/sections/SnippetTab.tsx` only shows the empty-state string. API `UserUpload` exists.
- **What is missing:** List, upload, and display portfolio media on the profile.

### 3.7 Job summary demo content — Stub

- **Where advertised:** Job summary tab (currently commented out of the management UI).
- **Evidence:** `reborn-mobile-app-v2/components/jobs/job-management/JobSummary.tsx` defaults to “Senior Full-Stack Mobile Engineer”, “TechCorp Innovations”, “$130,000 - $165,000 / year”.
- **What is missing:** Bind to the real job, or delete the unused demo screen.

---

## 4. Chat and notifications

### 4.1 Remote push notifications — Missing

- **Where advertised:** Business doc — push + in-app for job requests, messages, follows, announcements.
- **Evidence:** `useNotification.ts` schedules a **local** notification when a Socket.IO event arrives (app in foreground). API `notification.gateway.ts` stores the row if the user is offline — no Expo/FCM/APNs send. No device-token registration in the app.
- **What is missing:** Register a push token, send remote push when the app is backgrounded or killed.

### 4.2 Send emoji messages — Partial

- **Where advertised:** Business doc lists emoji as a message variant.
- **Evidence:** API and mobile can store/display `EMOJI`. There is no composer control to send an emoji-only message.
- **What is missing:** Emoji picker / send path (or stop advertising it as a distinct feature).

### 4.3 Conversation report moderation — Partial

- **Where advertised:** Users can report a conversation (spam, harassment, etc.).
- **Evidence:** Mobile `ConversationReportPortal.tsx` + API persist reports. No back-office queue or review pages.
- **What is missing:** Admin list, decide, and lock/ban from the report.

### 4.4 Lock conversations — Missing

- **Where advertised:** Business doc — admins can lock conversations.
- **Evidence:** `conversation.entity.ts` has `locked: boolean`. No admin UI or controller to set it.
- **What is missing:** Lock/unlock in back office and enforce it on send.

### 4.5 Back-office chat — Stub

- **Where advertised:** Admin chat module.
- **Evidence:** `reborn-back-office/src/components/chat/Chat.tsx` — `console.log("Open conversation", id)`; header shortcuts also log only.
- **What is missing:** Open a conversation, read history, reply, moderate.

---

## 5. Discovery, links, and offline

### 5.1 Product deep links / Universal Links — Missing

- **Where advertised:** Custom scheme `rebornmobileapp` in `app.json`; commented deep-link test in Settings.
- **Evidence:** Scheme exists for OAuth return (`useSSO.ts` path `oauth`). No `associatedDomains`, no App Links, no job/chat/profile HTTPS links.
- **What is missing:** Open a job, conversation, or profile from a web URL.

### 5.2 Offline / network-down UX — Missing

- **Where advertised:** Implied by a marketplace that must work on mobile networks.
- **Evidence:** Health check logs failures; no NetInfo banner or blocking retry on home, chat, or finance.
- **What is missing:** Visible, recoverable state when offline or when the API is down.

### 5.3 Notifications admin nav — Partial

- **Where advertised:** Back-office `/notifications` page exists.
- **Evidence:** `reborn-back-office/src/pages/notifications/index.tsx` is not linked from `AppSidebar.tsx`.
- **What is missing:** A sidebar entry (or remove the orphan page).

---

## 6. Copy and placeholders that fake a feature

These are not new products, but they present fake or wrong product behavior.

### 6.1 FAQ fallback — Stub

- **Evidence:** `reborn-mobile-app-v2/components/settings/support/faqs/FaqsPortal.tsx` `FALLBACK_FAQS` — “Is Instinct free to use?”, swipe left/right matching, Travel Mode. Shown when the CMS FAQ store is empty.
- **What is missing:** Reborn FAQs (jobs, pay, accounts) as fallback, or no fallback.

### 6.2 Hardcoded English in product flows — Partial

Locale JSON files for en/fr/ar are aligned, but several flows still embed English:

| Area | Examples | Path |
| --- | --- | --- |
| Quick Actions chrome | “Quick Actions”, “Edit”, “Done” | `QuickActions.tsx` |
| Explore filters | “Explore Filters”, “Start Date” | `useExploreFiltersFormStructure.tsx` |
| Auth / SSO | “E-mail”, “Continue with Google” | sign-in/up form structures, `SSOButtons.tsx` |
| Job apply | “Hi, I'm interested in this job because...” | `useJobApplyFormStructure.tsx` |
| Request decisions | “Approve Candidate”, “Withdraw Application” | `RequestDecisions.tsx` |
| My Space | “Search saved jobs...” | `JobSavedList.tsx`, `JobViewedList.tsx` |
| Top-up | “Top Up Balance”, “Pay Now” | `TopUp.tsx` |

- **What is missing:** Move these strings into i18n namespaces.

### 6.3 Back-office Arabic — Missing

- **Evidence:** Mobile has `i18n/locales/ar`. Back office has `public/locales/en` and `fr` only.
- **What is missing:** `ar` admin locales (or a written decision that admin is en/fr only).

### 6.4 Back-office sidebar placeholders — Stub

- **Evidence:** `AppSidebar.tsx` includes unused project links (“Design Engineering”, “Sales & Marketing”, “Travel”) pointing at `#`.
- **What is missing:** Remove sample nav or replace with real destinations.

---

## 7. Cross-platform gaps

| Feature | Has | Missing |
| --- | --- | --- |
| Delete account | API `DELETE /current-user` | Mobile wiring |
| Full job workflow | API + back-office inspector | Mobile Start/Finish/Hold/Review/hire events |
| Reviews / ratings | UI labels and hardcoded zeros | API + mobile submit/display |
| Arabic | Mobile locales | Back office |
| Conversation reports | Mobile submit + API store | Admin moderation UI |
| Conversation lock | Entity field | API action + admin UI |
| Notifications page | Admin page | Sidebar link |
| Chat for admins | List shell | Open/reply/moderate |
| Map on a job | Create/edit pin (mobile + admin) | Explore map / radius |
| Portfolio uploads | API `UserUpload` | Profile gallery UI |
| Push notifications | In-app + local when foreground | Remote push when backgrounded |
| OAuth | App shows Google, LinkedIn, Apple | Business doc still says Google only — decide and document the real set |

---

## 8. Feature index

| ID | Feature | Status | Surface |
| --- | --- | --- | --- |
| 1.1 | Delete account | Partial | Settings / API |
| 1.2 | Two-factor authentication | Stub | Settings |
| 1.3 | Data visibility controls | Stub | Settings |
| 1.4 | Download your data | Stub | Settings / API |
| 1.5 | About / Terms / Privacy (accurate, localized, hosted) | Stub | Settings |
| 1.6 | Email verification in settings list | Partial | Settings |
| 2.1 | Real payment checkout | Missing | Finance |
| 2.2 | Payment methods | Stub | Finance |
| 2.3 | Job escrow / hold | Missing | Jobs / Finance |
| 2.4 | Worker payouts | Missing | Finance |
| 2.5 | Payment verified badge | Stub | Jobs |
| 3.1 | Reviews and ratings | Missing | Home / Profile / Jobs |
| 3.2 | Job execution lifecycle on mobile | Partial | Job management |
| 3.3 | Approve request → job workflow | Partial | API / Jobs |
| 3.4 | Pipeline and share actions | Stub | Job management |
| 3.5 | Map-based job discovery | Missing | Explore |
| 3.6 | Profile gallery / portfolio | Stub | Profile |
| 3.7 | Job summary demo content | Stub | Job management |
| 4.1 | Remote push notifications | Missing | Notifications |
| 4.2 | Send emoji messages | Partial | Chat |
| 4.3 | Conversation report moderation | Partial | Chat / Admin |
| 4.4 | Lock conversations | Missing | Chat / Admin |
| 4.5 | Back-office chat | Stub | Admin |
| 5.1 | Universal / product deep links | Missing | Mobile |
| 5.2 | Offline / API-down UX | Missing | Mobile |
| 5.3 | Admin notifications in nav | Partial | Admin |
| 6.1 | FAQ fallback (wrong product) | Stub | Support |
| 6.2 | Hardcoded English in flows | Partial | Mobile i18n |
| 6.3 | Back-office Arabic | Missing | Admin |
| 6.4 | Sidebar sample links | Stub | Admin |

---

## 9. Highest-impact user-visible gaps

If prioritizing product work (independent of ops in the go-to-production doc):

1. **Delete account** — API is ready; the app still says Coming soon.
2. **Reviews** — advertised on home and profiles, entirely fake or disabled.
3. **Job lifecycle on mobile** — users cannot run a hired job to completion in the app.
4. **Real top-up / escrow / payouts** — finance UI implies money that is not collected or paid out.
5. **Remote push** — offline users do not get job or chat alerts.
6. **Instinct FAQ + Visa 4242 + fake 4.9 rating** — leftover copy that misrepresents the product.
7. **Map discovery and portfolio** — documented in the domain model, not in explore/profile.
