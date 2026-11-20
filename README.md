# CareerDock frontend

React + TypeScript + Vite frontend for the accompanying Spring Boot Job Portal API.

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (normally `http://localhost:8080`).
2. Start the backend with its database and required environment variables (`JWT_SECRET`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
3. Install and run:

```bash
npm install
npm run dev
```

For a production bundle, use `npm run build`.

## Implemented backend integration

- Authentication: `/api/auth/register`, `/api/auth/login`
- Public jobs: `/api/jobs`, `/api/jobs/{id}`
- Candidate applications: `/api/applications`, `/api/applications/my`
- Recruiter dashboard/jobs/applicants: `/api/recruiter/dashboard`, `/api/jobs`, `/api/applications/job/{jobId}`, `/api/applications/{id}/status`
- Admin directory: `/api/users`

The token is held in `localStorage` because the current backend returns a bearer token JSON payload rather than setting an HttpOnly cookie. This is a conscious compatibility trade-off: use a strict Content Security Policy and migrate to secure HttpOnly, SameSite cookies if the backend is extended to support cookie authentication.

## Deliberate API boundaries

- Resume links returned by the API are used directly; backend authorization remains the authority for resume downloads.
- The backend does not expose a recruiter's full job-edit payload in its dashboard response. This UI provides the edit form, but a production refinement should use the protected `GET /api/recruiter/jobs/{id}` endpoint before pre-filling every field.
- User deletion, suspension, and profile editing are intentionally not displayed because no backend APIs support them.
