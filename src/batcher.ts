import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';

import { getInputs } from './helpers';
import { UnmergedPullRequest } from '../types';
import { createBatchBranch } from './batch-branch';
import { createBatchPr, updateBatchPr } from './batch-pull';
import { getPulls, handleMergedPull, mergePulls } from './pulls';

export async function dependabotBatcher() {
  const { token, baseBranchName, batchBranchName } = getInputs();

  const {
    repo: { owner, repo },
  } = context;

  const octokit = new Octokit({
    auth: token,
    userAgent: 'Dependabot Batcher',
  });

  // eslint-disable-next-line prefer-const
  let { openPulls, pullsToCombine } = await getPulls(
    { octokit, owner, repo },
    baseBranchName,
  );

  if (!pullsToCombine.length) {
    console.info('ℹ️ No dependabot PRs have been found');

    return;
  }

  console.info(`ℹ️ ${pullsToCombine.length} dependabot PR(s) found`);

  const batchBranchAlreadyExists = await createBatchBranch(
    { octokit, owner, repo },
    openPulls,
    batchBranchName,
    baseBranchName,
  );

  const unmergedPulls: Array<UnmergedPullRequest> = await mergePulls(
    { octokit, owner, repo },
    pullsToCombine,
    batchBranchName,
  );

  unmergedPulls.forEach(({ number }) => {
    // Remove unmerged PRs from PRs to combine
    pullsToCombine = pullsToCombine.filter(pull => pull.number !== number);
  });

  if (pullsToCombine.length) {
    if (batchBranchAlreadyExists) {
      // The batch PR already exists, so we need to update it
      await updateBatchPr({ octokit, owner, repo }, pullsToCombine, openPulls);
    } else {
      // The combined PR doesn't exist, so we need to create it
      await createBatchPr({ octokit, owner, repo }, pullsToCombine);
    }

    for (const { branch, number } of pullsToCombine) {
      await handleMergedPull({ octokit, owner, repo }, branch, number);
    }
  } else {
    console.info('🚫 No PRs to combine');
  }

  if (unmergedPulls.length) {
    console.info('\n🚫 These branches could not be combined:');
    console.info(unmergedPulls.map(({ branch }) => branch).join('\n'));
  }

  console.info('\n✅ All done');
}
