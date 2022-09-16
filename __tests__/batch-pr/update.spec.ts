import { Octokit } from '@octokit/rest';

import { updateBatchPr } from '../../src/batch-pr/update';
import { PullRequest } from '../../types';

jest.mock('../../src/helpers.ts', () => ({
  getInputs: jest.fn().mockReturnValue({
    token: 'ABC',
    baseBranchName: 'someBaseBranch',
    batchBranchName: 'batched-dependabot-updates',
    batchPullTitle: 'Batched Dependabot updates',
  }),
  getMainBodyContent: jest.fn().mockReturnValue({
    pullsListMessage: 'Message',
    dateInfo: 'Date',
  })
}));

const mockCreatePull = jest.fn();
const mockUpdatePull = jest.fn();

const octokitMock = {
  rest: { pulls: { create: mockCreatePull, update: mockUpdatePull } }
};

describe('updateBatchPr', () => {
  it('should update the PR', async() => {
    await updateBatchPr(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      [ ],
      [ { title: 'Batched Dependabot updates', number: 0, body: 'foo' }, { title: 'Some other PR', number: 1, body: 'bar' } ] as Array<PullRequest>,
    );

    expect(mockUpdatePull).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      pull_number: 0,
      body: 'foo\n\nDate\n\nMessage',
    });
  });
});
