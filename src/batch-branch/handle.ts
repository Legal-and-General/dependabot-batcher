import { OctokitParams } from '../../types';
import { createBatchBranch } from './create';

export async function handleBatchBranch(
  { octokit, owner, repo }: OctokitParams,
  batchPrAlreadyExists: boolean,
  batchBranchName: string,
  baseBranchName: string,
) {
  const allRefs = await octokit.paginate(octokit.rest.git.listMatchingRefs, {
    owner,
    repo,
    ref: `heads/${batchBranchName}`,
  });

  // We have to filter for the exact branch name despite providing it to listMatchingRefs since it will return
  // entries that begin with the branch name: https://octokit.github.io/rest.js/v18#git-list-matching-refs

  const batchBranchAlreadyExists =
    allRefs.filter(ref => ref.ref === `refs/heads/${batchBranchName}`).length === 1;

  if (!batchPrAlreadyExists) {
    console.info(`ℹ️ ${batchBranchName}: There is no open PR for the batch branch`);

    if (batchBranchAlreadyExists) {
      console.info(`ℹ️ ${batchBranchName}: Stale branch exists. Deleting it`);

      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref: `heads/${batchBranchName}`,
      });
    }

    await createBatchBranch({ octokit, owner, repo }, batchBranchName, baseBranchName);
  }

  return;
}
