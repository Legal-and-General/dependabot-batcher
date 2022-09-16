import { OctokitParams } from '../../types';

export async function createBatchBranch(
  { octokit, owner, repo }: OctokitParams,
  batchBranchName: string,
  baseBranchName: string,
) {
  console.info(`ℹ️ ${batchBranchName}: Creating branch`);

  const {
    data: {
      object: { sha: baseBranchSHA },
    },
  } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranchName}`,
  });

  // Create new branch from base branch

  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${batchBranchName}`,
    sha: baseBranchSHA,
  });
}
