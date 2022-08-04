import { OctokitParams, PullRequest } from '../types';

export async function createBatchBranch(
  { octokit, owner, repo }: OctokitParams,
  openPulls: Array<PullRequest>,
  batchBranchName: string,
  baseBranchName: string,
) {
  const batchBranchAlreadyExists = !!openPulls.filter(
    pr => pr.head.ref === batchBranchName,
  ).length;

  const {
    data: {
      object: { sha: baseBranchSHA },
    },
  } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranchName}`,
  });

  if (!batchBranchAlreadyExists) {
    console.info(`ℹ️ ${batchBranchName}: Creating branch`);

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${batchBranchName}`,
      sha: baseBranchSHA,
    });
  }

  return batchBranchAlreadyExists;
}
