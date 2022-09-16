import { OctokitParams, UnmergedPullRequest } from '../../types';
import { getInputs, getMainBodyContent } from '../helpers';

export async function createBatchPr(
  { octokit, repo, owner }: OctokitParams,
  pullsToCombine: Array<UnmergedPullRequest>,
) {
  const { dateInfo, pullsListMessage } = getMainBodyContent(pullsToCombine);
  const { baseBranchName, batchBranchName, batchPullTitle } = getInputs();

  const body = `This PR was created by the [Dependabot Batcher](https://github.com/Legal-and-General/dependabot-batcher) Action by combining the following PRs:\n\n${dateInfo}\n\n${pullsListMessage}`;

  console.info('ℹ️ Creating the batch PR');

  await octokit.rest.pulls.create({
    owner,
    repo,
    title: batchPullTitle,
    head: batchBranchName,
    base: baseBranchName,
    body: body,
  });
}
