import { OctokitParams, PullRequest, UnmergedPullRequest } from '../types';
import { getInputs, getMainBodyContent } from './helpers';

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

export async function updateBatchPr(
  { octokit, repo, owner }: OctokitParams,
  pullsToCombine: Array<UnmergedPullRequest>,
  openPulls: Array<PullRequest>,
) {
  const { dateInfo, pullsListMessage } = getMainBodyContent(pullsToCombine);
  const { batchPullTitle } = getInputs();

  const { number, body } = openPulls.filter(pull => pull.title === batchPullTitle)[0];

  console.info('ℹ️ Update the existing batch PR');

  await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: number,
    body: `${body}\n\n${dateInfo}\n\n${pullsListMessage}`,
  });
}
