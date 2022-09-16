import { getInput } from '@actions/core';
import { PullRequest, UnmergedPullRequest } from '../types';

export function getInputs() {
  const token: string = getInput('token');
  const baseBranchName: string = getInput('baseBranchName');
  const batchBranchName: string = getInput('batchBranchName');
  const batchPullTitle: string = getInput('batchPullTitle');

  return {
    token,
    baseBranchName: baseBranchName || 'main',
    batchBranchName: batchBranchName || 'batched-dependabot-updates',
    batchPullTitle: batchPullTitle || 'Batched Dependabot updates',
  };
}

export function getMainBodyContent(pullsToCombine: Array<UnmergedPullRequest>) {
  const pullsListMessage = pullsToCombine.map(pull => `- #${pull.number}\n`).join('');
  const dateInfo = `**${new Date().toDateString()}**`;

  return {
    pullsListMessage,
    dateInfo,
  };
}

export function isBatchPrOpen(
  openPulls: Array<PullRequest>,
  batchBranchName: string,
): boolean {
  return !!openPulls.filter(pr => pr.head.ref === batchBranchName).length;
}
