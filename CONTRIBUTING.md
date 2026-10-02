# Contributing

Use short-lived branches and pull requests into `main`. Keep each pull request
focused on one change so it is easy to review and revert.

## Make a change

1. Update your local `main`: `git switch main && git pull --ff-only`.
2. Create a branch, such as `git switch -c feat/search` or `git switch -c fix/navigation`.
3. Install dependencies with Node.js 24 and the Yarn version pinned in the root
   `package.json`: `corepack enable` then `yarn install --immutable`.
4. Make the change and update relevant tests and documentation.
5. Run `yarn lint:ci`, `yarn build`, and `yarn test:ci` before requesting review.
6. Push the branch and open a pull request targeting `main`.
7. Resolve review feedback and CI failures, squash merge, then delete the branch.

Use descriptive commits and pull request titles, for example `feat: add search`
or `fix: preserve navigation state`. Squash merging gives `main` one commit per
pull request. Use a new pull request to revert a change when necessary.

CI runs on pull requests and pushes to `main`. It checks line endings, lints
without modifying source, type-checks with TypeScript, and runs tests on Linux
and Windows using Node.js 24. Linux also bundles and packs distributable packages.
The VS Code extension is checked using the root TypeScript version.

The existing `yarn lint` and `yarn pre-commit` commands modify files. Run
generators deliberately and review their output before committing. When browser
page scripts change, run `yarn embed` manually; do not edit generated files under
`packages/ts-page-scripts/src/embed` directly. CI does not regenerate these files.

## Configure GitHub once

After pushing these files and obtaining the first successful CI run, create an
active branch ruleset targeting `main` in **Settings → Rules → Rulesets**:

- Require a pull request before merging and resolve all review conversations.
- Require `Checks (ubuntu-latest)` and `Checks (windows-latest)` to pass.
- Require branches to be up to date before merging.
- Block force pushes and branch deletion.
- For a team, require one approving review and dismiss stale approvals. Solo
  maintainers can require pull requests without requiring another reviewer.

Under **Settings → General → Pull Requests**, enable squash merging and automatic
branch deletion. Disable merge commits and rebase merging to keep a consistent
history. Under **Settings → Actions → General**, allow the official actions used
by the workflows and keep default workflow token permissions read-only.

These settings must be enabled on GitHub; committing workflow files does not
enforce branch protection. See GitHub's [ruleset documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

## Dependencies and publishing

Dependabot opens weekly pull requests for GitHub Actions and dependencies. Review
them through the same CI and pull request process as other changes.

The existing **Publish new npm packages** workflow remains a manual operation.
It only publishes packages missing from npm; it is not a version-release workflow.
Use its default dry run first and review the registry results before publishing.
Restrict the `npm-publish` environment to `main` and configure required reviewers
when a team is available. Publishing existing package versions needs a separate
release process; merging a pull request does not publish to npm.
