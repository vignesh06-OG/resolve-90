# Contributing

## Local workflow

1. Use Node.js 20.19 or later.
2. Create a focused branch from a passing `main`.
3. Run `npm ci` and `npm run quality` before opening a pull request.
4. Add tests for behavior and update evidence documentation when quality claims change.
5. Keep domain logic out of React components and provider calls out of pages.

## Commit style

Use imperative Conventional Commit messages where practical:

- `feat(domain): reject inaccessible intervention plans`
- `test(application): cover stale transport evidence`
- `docs(security): record gateway rate-limit limitation`

A commit should be independently reviewable and should not knowingly leave `main` broken.

## Pull-request checklist

The repository template requires challenge mapping, security/privacy impact, accessibility impact, tests, and rollback notes. A high-risk operational change requires review from both the domain and accessibility owners.

## Definition of done

- acceptance behavior is mapped to a challenge requirement;
- strict TypeScript and lint pass with zero warnings;
- unit/integration tests cover changed invariants;
- keyboard and screen-reader behavior are considered;
- no secret or sensitive venue data is introduced;
- architecture/security/accessibility docs remain accurate;
- `npm run quality` passes.

## Security reports

For this challenge repository, send a private report to `security@resolve90.example` (placeholder project contact) with a minimal reproduction and impact statement. Do not send real venue data or credentials. In a production organization, replace this placeholder with an actively monitored security channel and publish a `security.txt` policy.
