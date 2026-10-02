# Reborn — General Business Context

## 1. What Is Reborn?

Reborn is a **freelance and gig-economy marketplace** that connects two types of users:

- **Clients** — individuals or businesses who post jobs they need done.
- **Workers** — skilled professionals who browse, apply to, and complete those jobs.

The platform provides the full lifecycle of a job engagement: discovery, application, negotiation, execution, review, and payment — all through a mobile-first experience backed by a dedicated admin back-office.

For what must be implemented before a public launch (stores, payments, security, deploy, compliance), see [Go to Production](../ops/GO-TO-PRODUCTION.md). For user-facing features that are missing, stubbed, or only half-wired, see [Missing Features](./MISSING-FEATURES.md).

---

## 2. Platform Components

| Component                               | Role                                                                      | Audience               |
| --------------------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| **Mobile App** (`reborn-mobile-app-v2`) | Consumer-facing application for clients and workers                       | End users              |
| **Back Office** (`reborn-back-office`)  | Admin panel for managing users, content, jobs, and platform operations    | Internal team / admins |
| **API** (`reborn-api`)                  | Central backend powering both frontends, handling business logic and data | All consumers          |

---

## 3. Core Domain Concepts

### 3.1 Users

Every user on the platform has a profile with:

- **Identity**: first name, last name, username, email, date of birth, gender.
- **Professional info**: bio, skills (from a predefined catalog), experiences (work history), educations.
- **Location**: region (from a predefined list).
- **Media**: profile picture, cover photo, portfolio uploads.
- **Social**: followers/following system (similar to social networks).
- **Finance**: points balance, monetary balance, transaction history.
- **Privacy**: public or private profile toggle.

Users authenticate via **email/password** or **Google OAuth (SSO)**.

### 3.2 Jobs

A job is a work opportunity posted by a client. It includes:

- **Title & Description** — what the job entails.
- **Price & Pricing Type** — fixed price or hourly rate, with currency selection.
- **Category** — from a predefined job category catalog (e.g., Plumbing, Design, IT).
- **Tags** — multiple tags from a predefined catalog for discoverability.
- **Style** — work arrangement: Remote, On-site, Flexible Hours, Full-time, Part-time, Freelance, Weekend Job, Night Shift, Day Shift.
- **Difficulty** — Entry Level, Mid Level, Senior Level, Internship.
- **Location** — latitude/longitude coordinates for map-based discovery.
- **Media** — ordered image/video uploads showing the job scope.

### 3.3 Job Requests

When a worker wants to apply to a job, they create a **job request** containing:

- An optional **message** explaining why they're a good fit.
- An optional **proposed price** (counter-offer to the listed price).
- A **status** that is driven by a workflow state machine.

### 3.4 Job Interactions

- **Job Views** — tracked to measure engagement and analytics.
- **Job Saves** — users can bookmark jobs for later review.

### 3.5 Chat

The platform has a **real-time messaging system** (Socket.IO) supporting:

- **Text messages**, **emoji messages**, **static messages** (system-generated).
- **Media sharing**: images, videos, files — with upload progress tracking.
- **Conversations** between two or more participants.
- **Message links**: URLs within messages are parsed and stored separately.
- **Conversation reporting**: users can report conversations for Spam, Harassment, Inappropriate Content, Scam/Fraud, or Other reasons.
- **Locked conversations**: conversations can be locked by admins.

### 3.6 Notifications

Push notifications and in-app notification center for real-time updates on:

- Job request status changes.
- New messages.
- Follow activity.
- System announcements.

### 3.7 Finance & Points

- **Points system** — users earn/spend points through platform activity (credit/debit transactions).
- **Balance** — monetary balance tracked per user (decimal precision).
- **Point transactions** — auditable ledger of all point movements with description and type.

### 3.8 Reference Data

The platform uses a **reference data system** (`RefParam`) for managing configurable catalogs:

- Job categories, job tags, skills, regions, currencies.
- Seeded at startup and manageable through the back office.

---

## 4. Key Business Flows

### 4.1 Job Lifecycle (XState Workflow)

The job follows a complex state machine managed by XState:

```
Draft → Posted → Candidate Pending → Not Started → Pending → Finished
                                                          ↗ On Hold (pausable)
                                    → Reviewed By Worker → Reviewed By Worker & Client
                                    → Failed
                                    → Successful → Archived
```

**States explained:**

| Status                        | Description                                               |
| ----------------------------- | --------------------------------------------------------- |
| `Draft`                       | Job created but not yet visible to workers                |
| `Posted`                      | Job is live and discoverable                              |
| `Candidate Pending`           | Client has chosen a candidate, awaiting worker acceptance |
| `Not Started`                 | Worker accepted, job hasn't begun                         |
| `Pending`                     | Job is in progress                                        |
| `On Hold`                     | Job temporarily paused                                    |
| `Finished`                    | Work is done, pending review                              |
| `Reviewed By Worker`          | Worker submitted their review                             |
| `Reviewed By Worker & Client` | Both parties reviewed                                     |
| `Failed`                      | Job marked as failed                                      |
| `Successful`                  | Job completed successfully                                |
| `Archived`                    | Job archived after completion                             |
| `Deleted`                     | Soft-deleted                                              |

**Key events:** Post, Unpublish, Choose Candidate, Refuse Candidate, Accept Candidate, Start, Finish, Worker Review, Client Review, Mark Successful, Hold, Stop Hold, Mark Failed, Archive.

### 4.2 Job Request Workflow (XState Workflow)

When a worker applies, the request follows:

```
Pending → Approved (final)
        → Rejected / Cancelled (final)
        → Waitlist → Approved / Rejected (final)
```

| Status     | Description                                              | Actor           |
| ---------- | -------------------------------------------------------- | --------------- |
| `Pending`  | Awaiting client review                                   | —               |
| `Approved` | Client accepted the worker → contract begins             | Client          |
| `Rejected` | Client declined the worker OR worker cancelled           | Client / Worker |
| `Waitlist` | Client placed the worker on hold for later consideration | Client          |

### 4.3 User Onboarding

1. User signs up via email/password or Google SSO.
2. User fills in their profile: name, bio, skills, region, profile picture.
3. User optionally adds work experience and education history.
4. User starts browsing or posting jobs.

### 4.4 Job Discovery & Application

1. Worker browses jobs (with category/tag/style/difficulty/location filters).
2. Worker views a job detail page (view is tracked).
3. Worker can save the job for later.
4. Worker applies by creating a job request (with optional message and price proposal).
5. Client reviews incoming requests and approves, rejects, or waitlists.

### 4.5 Social & Engagement

- Users can follow/unfollow other users.
- Public profiles are browsable; private profiles are restricted.
- Chat conversations are initiated between users.

---

## 5. Roles & Access Levels

| Role                     | Description                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| **User (Client/Worker)** | Regular platform user. All users can both post and apply to jobs — the role is contextual.             |
| **Admin**                | Back-office operator with elevated permissions. Manages users, content, reports, system configuration. |

Permissions and roles are **seeded at application startup** from a predefined catalog and managed via an RBAC (Role-Based Access Control) system.

---

## 6. Internationalization (i18n)

The platform supports **multiple languages** across all components:

- Mobile app: react-i18next with locale JSON files.
- Back office: next-i18next with HTTP backend and localStorage caching.
- All UI strings are externalized for translation.

---

## 7. Media & Storage

- File uploads are stored in **S3**.
- The system supports multiple file types: images, videos, documents.
- Uploads are organized into predefined storage folders (seeded at startup).
- Files can be public or private, temporary or permanent.

---

## 8. Email & Communications

- Transactional emails are sent via **SMTP** (configurable provider).
- Email templates are seeded and managed through the template system.
- The mailer gracefully degrades if SMTP is misconfigured (logs instead of sending).
