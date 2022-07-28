# Dependabot Batcher

An action to ease your dependency maintenance and save GitHub minutes.

Dependabot is great - it alerts you to vulnerable and outdated dependencies and even creates PRs to update them.
However, it can often create multiple PRs a day, all of which consume valuable GitHub minutes in your CI pipeline.

Moreover, reviewing them and managing your dependencies can soon become extremely time-consuming, not to mention that it
pollutes your Pull Requests page.

Some of our teams using this action internally have reported saving almost a week of maintenance time every month! 

## What does it do?

Dependabot Batcher will automatically merge your Dependabot PRs into one, providing links to the original PRs, which are
then closed. This allows you to turn off your CI checks for Dependabot PRs, only running them on the PR that Dependabot
Batcher creates for you.

If you haven't merged the batch PR when it next runs, it'll automatically append the new additions.
