# Job Portal Frontend

A responsive job portal web application built with **React 18**, **TypeScript**, and **Vite**. It connects to the companion Spring Boot REST API and provides candidate, recruiter, and administrator experiences.

Backend repository: [job-portal-backend](https://github.com/aditilal01/job-portal-backend)

## Features

### Candidate
- Register and sign in.
- Browse jobs with title/keyword, location, and experience filters.
- View job details and submit applications with a resume.
- Track submitted applications and their statuses.
- Manage a professional profile and control recruiter visibility.
- Save jobs and manage the saved-jobs list.
- Upload a resume for AI-powered analysis and view AI job matches (requires backend AI configuration).

### Recruiter
- Recruiter dashboard and job-posting workflows.
- Create, edit, and deactivate job postings.
- View applicants for owned jobs and update application statuses.
- Access candidate professional summaries only when the candidate has enabled recruiter visibility.

### Administrator
- View dashboard statistics and the user directory.
- Search users and filter by role.
- User deletion/suspension controls are not exposed because the current API does not provide those operations.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 18, TypeScript |
| Build / dev server | Vite 6 |
| Routing | React Router 6 |
| HTTP | Axios |
| Forms / validation | React Hook Form, Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Tailwind CSS 3 |
| Production container | Nginx (Docker) |

## Prerequisites

- Node.js 18 or later and npm
- The [Job Portal backend](https://github.com/aditilal01/job-portal-backend) running locally or at a reachable API URL

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/aditilal01/job-portal-frontend.git
cd job-portal-frontend
```

### 2. Configure the API URL

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Set the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The value is the backend origin, not an individual endpoint path. Restart the Vite server after changing environment variables. Only public configuration belongs in `VITE_*` variables—never put passwords, JWT signing secrets, or OpenAI API keys in the frontend.

### 3. Install dependencies and start Vite

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript project build and create the production bundle |
| `npm run preview` | Preview the production build locally |

Build before submitting changes:

```bash
npm run build
```

The production output is generated in `dist/`.

## Run with Docker

The frontend Dockerfile builds the Vite app and serves the static output with Nginx:

```bash
docker build -t job-portal-frontend .
docker run --rm -p 5173:80 job-portal-frontend
```

For a complete local stack, use the Docker Compose configuration in the backend repository. Its Compose setup expects the frontend repository at a sibling path named `job-portal-frontend`.

## Backend integration

The frontend uses the backend REST API for authentication and role-protected workflows. Configure `VITE_API_BASE_URL` to match the backend origin and ensure the backend CORS configuration allows the frontend origin (by default, `http://localhost:5173`).

Key API areas include:

- Authentication: `/api/auth/register`, `/api/auth/login`
- Public job search and details: `/api/jobs`
- Candidate profile: `/api/candidate/profile`
- Saved jobs: `/api/candidate/saved-jobs`
- Candidate applications: `/api/applications`, `/api/applications/my`
- Recruiter dashboard and applicant management: `/api/recruiter/dashboard`, `/api/applications/job/{jobId}`, `/api/applications/{id}/status`
- AI resume analysis and matching: `/api/candidate/ai/resume/analyze`, `/api/candidate/ai/job-matches`
- Admin statistics and users: `/api/admin/stats`, `/api/admin/users`

See the backend repository's README and Swagger UI for endpoint schemas, authentication requirements, and setup details.

## Authentication and security

The API returns a bearer token, which the frontend stores in browser `localStorage` for authenticated requests. This is a compatibility choice for the current API contract; it carries XSS-related risks compared with an HttpOnly-cookie design. Production deployments should use HTTPS, apply a strong Content Security Policy, prevent injection vulnerabilities, and consider migrating to secure HttpOnly, SameSite cookies if the backend supports them.

The frontend must never contain server-side secrets. In particular, configure `OPENAI_API_KEY` only in the backend environment, not in this repository.

## Project structure

The source is organized around React pages, reusable components, API/service modules, and shared types. The exact folder layout may evolve; the main responsibilities are:

- `src/pages/` — route-level screens
- `src/components/` — reusable UI components
- `src/services/` — API client and feature-specific service calls
- `src/types/` — shared TypeScript types

## Troubleshooting

- **Network error / failed API request:** confirm the backend is running and `VITE_API_BASE_URL` points to the correct origin.
- **CORS error:** add the exact frontend origin to the backend's `CORS_ORIGINS` setting, then restart the backend.
- **401 Unauthorized:** sign in again; the stored bearer token may be missing or expired.
- **AI tools unavailable:** configure `OPENAI_API_KEY` in the backend environment and restart the backend. Do not add the key to this frontend project.

## License

No license has been specified for this repository. Contact the repository owner before reusing or redistributing the code.
