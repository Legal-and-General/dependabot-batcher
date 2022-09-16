import { OctokitParams, PullRequest, UnmergedPullRequest } from '../../types';
import { getInputs, getMainBodyContent } from '../helpers';

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
