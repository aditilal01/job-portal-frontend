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
- Candidate profile: `GET/PUT /api/candidate/profile` (candidate-only; profile fields are stored separately from account credentials)
- Candidate applications: `/api/applications`, `/api/applications/my`
- Recruiter dashboard/jobs/applicants: `/api/recruiter/dashboard`, `/api/jobs`, `/api/applications/job/{jobId}`, `/api/applications/{id}/status`
- Admin directory: `/api/users`

The token is held in `localStorage` because the current backend returns a bearer token JSON payload rather than setting an HttpOnly cookie. This is a conscious compatibility trade-off: use a strict Content Security Policy and migrate to secure HttpOnly, SameSite cookies if the backend is extended to support cookie authentication.

## Deliberate API boundaries

- Resume downloads use the authenticated API client so protected files are requested with the candidate/recruiter bearer token.
- Recruiter job editing fetches the full job record from the protected `GET /api/recruiter/jobs/{id}` endpoint before pre-filling the form.
- Public job search supports title/skills keyword matching, location filtering, maximum experience, pagination, and sorting.
- User deletion and suspension are not displayed because no backend APIs support them.


## AI Career Tools

Candidates can open **AI career tools** to upload a PDF, DOC, or DOCX resume for AI-powered analysis and request ranked matches against active job postings. The backend requires `OPENAI_API_KEY` in its private environment; the key must never be exposed in frontend environment variables.
