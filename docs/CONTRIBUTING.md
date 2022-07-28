# Contributing

Hi, glad you are here - all contributions are very much welcome!

Please do raise an [issue](https://github.com/Legal-and-General/dependabot-batcher/issues) before starting a piece of work. Our
contributors can help provide guidance to make sure your effort isn't wasted.

### Commit message examples

Fix

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

Breaking change

```
feat(button): allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

## Commit Signing

To ensure that changes come from an entrusted source all commits must
be [signed](https://help.github.com/en/articles/about-commit-signature-verification), Follow the steps below to setup
commit signing.

1. [Generating a new GPG Key](https://help.github.com/en/articles/generating-a-new-gpg-key)

   Make sure the email address you use, matches your local git email address (`git config --get user.email`) and that of
   your GitHub account. If not, either change your git email address or add this address to your GitHub account.

2. [Adding a new GPG key to your GitHub account](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
3. [Signing commits](https://help.github.com/en/articles/signing-commits)

## Branch naming convention

Branches should be in `kebab-case` format.
The repository is set up with a `pre-push` hook that will prevent the user from pushing if the branch name doesn't match
the correct format.

## Review Process

Pull requests require two successful approvals before they can be merged. One review must be from
a [CODEOWNER](../.github/CODEOWNERS). We also require that developers working on a specific project seek review from
someone on a different project. The aim being that by removing any immediate delivery pressure we can ensure a high
level of quality and negate the risk of factions forming within the codebase, currently we cannot automate this process
and so it must be based on trust.

### Code Owners

Code Owners are chosen based on a history of consistent contributions. Code Owners should have an understanding of the
current issues list and have a wider view of the technical direction of the project. They should help to steer technical
direction via pull request reviews and be focused on the longer term success of the project. Code Owners are not limited
to being from our particular organisation.

## GitHub Actions

The build is currently handled by [Github Actions](https://help.github.com/en/actions), the config for which is checked
into the [.github](../.github) directory. The build will run on every pull request and run standard verification tasks
e.g. linting, unit testing, test build. The build will need to be green in order for a pull request to pass.
