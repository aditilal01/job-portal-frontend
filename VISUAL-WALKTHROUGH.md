# Visual walkthrough

## Public experience

1. **Landing page** — dark-navy hero with a live skills/location search control, featured API-loaded jobs, and a concise three-step product explanation.
2. **Job board** — responsive card grid with skills, location, maximum experience, sort, pagination, empty, loading, and error states.
3. **Job detail** — clear role overview, skill chips, description, optional resume picker, and protected candidate application action.

## Account experience

1. **Login and registration** — polished split-screen layouts, Zod validation, candidate/recruiter selection only, API error display, and JWT-authenticated redirects.
2. **Candidate dashboard** — application totals, status filtering, recent application rows, and resume access where the API provides it.
3. **Recruiter dashboard** — jobs/active jobs/applicant-count summary cards, job creation, deactivation confirmation, applicant management, authorized resume download, and status-transition controls.
4. **Admin dashboard** — real user-directory totals and a responsive table. No unsupported management buttons are shown.

All views use the same light-grey canvas, white rounded cards, deep-navy primary surfaces, restrained indigo actions, responsive grids, keyboard-labelable form controls, and API-driven loading/error/empty states.
