import { OctokitParams, PullRequest, UnmergedPullRequest } from '../types';

export async function getPulls(
  { octokit, owner, repo }: OctokitParams,
  baseBranchName: string,
) {
  const openPulls: Array<PullRequest> = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    state: 'open',
    base: baseBranchName,
    per_page: 100,
  });

  const pullsToCombine = openPulls
    .filter(pr => pr.head.ref.startsWith('dependabot'))
    .map(pr => ({
      branch: pr.head.ref,
      number: pr.number,
    }));

  return {
    openPulls,
    pullsToCombine,
  };
}

// Loop over the branches and merge with batchBranchName.
// If the branch cannot be merged, then skip

export async function mergePulls(
  { octokit, owner, repo }: OctokitParams,
  pullsToCombine: Array<UnmergedPullRequest>,
  batchBranchName: string,
) {
  const unmergedPulls: Array<UnmergedPullRequest> = [];

  for (const { branch, number } of pullsToCombine) {
    console.info(`ℹ️ ${branch}: Trying to merge into ${batchBranchName}`);

    try {
      await octokit.rest.repos.merge({
        owner,
        repo,
        base: batchBranchName,
        head: branch,
      });
    } catch (error) {
      console.log('error', error);

      unmergedPulls.push({
        branch,
        number,
      });

      console.info(`🚫 ${branch}: ${error}`);
    }
  }

  return unmergedPulls;
}

export async function handleMergedPull(
  { octokit, owner, repo }: OctokitParams,
  branch: string,
  number: number,
) {
  // Close the PRs that have been combined into the new branch
  console.info(`ℹ️ Closing PR #${number}`);

  await octokit.rest.pulls.update({
    owner,
    repo,
    status: 'closed',
    pull_number: number,
  });

  console.info(`ℹ️ Deleting branch ${branch}`);

  await octokit.rest.git.deleteRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });

  console.info(`ℹ️ Adding label to PR #${number}`);

  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: number,
    labels: [ 'dependabot-batched' ],
  });
}
