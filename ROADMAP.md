# HireHub Product & Engineering Roadmap

This checklist is the working implementation plan for evolving HireHub from a functional job portal into a reliable recruitment platform. Items are checked only after implementation and verification.

## Phase 0 — Stabilize the existing platform
- [ ] Verify authenticated resume downloads for candidates and recruiters
- [ ] Verify job editing, deactivation, application submission and status updates
- [ ] Remove obsolete resume-download interception code
- [ ] Keep frontend and backend API documentation aligned
- [ ] Add automated frontend and backend regression tests for core workflows

## Phase 1 — Complete core product features
- [x] Candidate profile API and persistence (implementation committed; build/runtime verification pending)
- [x] Candidate profile editing and completion indicator (implementation committed; build/runtime verification pending)
- [ ] Saved/bookmarked jobs persisted per candidate
- [ ] Better job search: keyword, location, skills, experience and sorting
- [ ] Admin user management and job moderation
- [ ] Recruiter profile and company information

## Phase 2 — Recruitment workflow
- [ ] Applicant pipeline with status history and recruiter notes
- [ ] Interview scheduling and candidate responses
- [ ] In-app notifications
- [ ] Email notifications for applications and status changes
- [ ] Recruiter hiring analytics

## Phase 3 — AI capabilities
- [ ] Resume parsing into structured candidate profile data
- [ ] Resume-to-job matching with explainable match factors
- [ ] Skill-gap suggestions
- [ ] Personalized job recommendations using semantic similarity
- [ ] Evaluation dataset and metrics for AI features

## Phase 4 — Production readiness
- [ ] Role/ownership authorization tests for every protected endpoint
- [ ] Input validation, file security and rate limiting review
- [ ] Unit and integration test coverage
- [ ] CI checks for frontend and backend
- [ ] Dockerized deployment and environment-specific configuration
- [ ] Centralized logs, health checks and error monitoring
- [ ] Accessibility, responsive design and performance review
- [ ] Deployment guide and updated architecture documentation

## Delivery rules
- Implement one coherent feature at a time.
- Inspect existing code and API contracts before changing them.
- Do not mark a task complete until the build/tests pass and the workflow is verified.
- Never expose admin registration publicly.
