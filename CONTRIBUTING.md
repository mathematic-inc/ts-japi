# Contributing

Mathematic uses AI agents to maintain this repository. Reviewing an unsolicited pull request often
takes longer than implementing a proposal after we agree on it.

## Propose a change

1. [Start a GitHub Discussion](https://github.com/mathematic-inc/ts-japi/discussions/new) for any bug report or proposed change.
2. Wait for a maintainer to review the proposal.
3. If we accept it, a Mathematic maintainer or agent will open the implementation pull request.

When Mathematic implements a proposal, the implementation pull request will link to the Discussion
and credit its original author.

GitHub restricts pull request creation to Mathematic maintainers and repository collaborators who
have write, maintain, or admin access, plus authorized maintenance agents.

## Develop an accepted change

Organization members and repository collaborators should install the pinned tools and Git hooks,
then run every project check before submitting a pull request:

```sh
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- hk install
mise exec -- pnpm typecheck
mise exec -- pnpm build
mise exec -- pnpm test
mise exec -- pnpm audit --audit-level high
mise exec -- hk check --all --slow
```
