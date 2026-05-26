<!-- Describe your changes in one or two sentences -->
## Summary

Describe the changes introduced by this PR and the problem it solves.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactor
- [ ] Chore

## Related issues
Link any related issue numbers (e.g. fixes #12)

## Changes
- High-level list of changes made

## How to test
Provide steps to reproduce and test the changes locally, e.g.:

1. Install dependencies
2. Run seed (if needed)
3. Start dev servers

## Labels (suggested)
- Add one or more: `server`, `client`, `docs`, `ci`, `infra`, `breaking`

## Suggested reviewers
- Mention team members or owners for `server/` (backend) and `client/` (frontend) code.

## Checklist (project-specific)
- General
	- [ ] My code follows project style and linting rules
	- [ ] I added/updated tests where relevant
	- [ ] CI passes for this PR
	- [ ] I updated documentation where necessary

- Server (`server/`) checklist (if backend changes)
	- [ ] API contract changes documented (openapi / README)
	- [ ] Database migrations / model changes accounted for
	- [ ] Secrets/environment variable additions documented
	- [ ] Sandbox/evaluator changes reviewed for security

- Client (`client/`) checklist (if frontend changes)
	- [ ] UI behavior manually tested (screens, flows)
	- [ ] Accessibility basics checked (focus order, labels)
	- [ ] New components covered by unit tests where applicable

## Deployment notes
Any special deployment steps, migration commands, or infra changes required (e.g., update `MONGO_URI`, add S3 permissions, update Render service). If this PR requires downtime or a coordinated deploy, note that here.

## Reviewer notes
Anything the reviewer should focus on (security, performance, migration risk, UX changes).

