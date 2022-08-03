import { dependabotBatcher } from '../src/batcher';
import { getInputs } from '../src/helpers';
import { createBatchBranch } from '../src/batch-branch';
import { getPulls, handleMergedPull, mergePulls } from '../src/pulls';
import { createBatchPr, updateBatchPr } from '../src/batch-pull';

jest.mock('../src/pulls', () => ({
  getPulls: jest.fn().mockReturnValue({
    openPulls: [ { head: { ref: 'foo' }, number: 0 }, { head: { ref: 'bar' }, number: 1 } ],
    pullsToCombine: [ {
      branch: 'foo',
      number: 0,
    } ],
  }),
  handleMergedPull: jest.fn(),
  mergePulls: jest.fn(() => ([])),
}));

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(() => ({ mocked: true })),
}));

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'Legal-and-General',
      repo: 'SomeRepository'
    },
  }
}));

jest.mock('../src/helpers', () => ({
  getMainBodyContent: jest.fn(() => ({
    pullsListMessage: 'Message',
    dateInfo: 'Date',
  })),
  getInputs: jest.fn(() => ({
    token: 'ABC',
    baseBranchName: 'someBaseBranch',
    batchBranchName: 'batched-dependabot-updates',
    batchPullTitle: 'Batched Dependabot updates',
  })),
}));

jest.mock('../src/batch-branch', () => ({
  createBatchBranch: jest.fn(),
}));

jest.mock('../src/batch-pull', () => ({
  createBatchPr: jest.fn(),
  updateBatchPr: jest.fn(),
}));

describe('dependabotBatcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getInputs()', async () => {
    await dependabotBatcher();

    expect(getInputs).toBeCalled();
  });

  it('should call getPulls', async () => {
    await dependabotBatcher();

    expect(getPulls).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      'someBaseBranch'
    );
  });

  it('should not continue if no dependabot pulls found', async () => {
    (getPulls as jest.Mock).mockReturnValue({
      openPulls: [ { head: { ref: 'foo' }, number: 0 }, { head: { ref: 'bar' }, number: 1 } ],
      pullsToCombine: [],
    });

    await dependabotBatcher();

    expect(createBatchBranch).not.toBeCalled();
  });

  it('should create batch branch if there are dependabot pulls', async () => {
    const openPulls = [ { head: { ref: 'foo' }, number: 0 }, { head: { ref: 'bar' }, number: 1 } ];

    (getPulls as jest.Mock).mockReturnValue({
      openPulls,
      pullsToCombine: [ {
        branch: 'foo',
        number: 0,
      } ],
    });

    await dependabotBatcher();

    expect(createBatchBranch).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      openPulls,
      'batched-dependabot-updates',
      'someBaseBranch',
    );
  });

  it('should merge pulls if there are dependabot pulls', async () => {
    const openPulls = [ { head: { ref: 'foo' }, number: 0 }, { head: { ref: 'bar' }, number: 1 } ];

    (getPulls as jest.Mock).mockReturnValue({
      openPulls,
      pullsToCombine: [ {
        branch: 'foo',
        number: 0,
      } ],
    });

    await dependabotBatcher();

    expect(mergePulls).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      [ { branch: 'foo', number: 0 } ],
      'batched-dependabot-updates'
    );
  });

  it('should update batch PR if it exists and there are prs to combine', async () => {
    const pullsToCombine =  [ {
      branch: 'foo',
      number: 0,
    } ];

    (getPulls as jest.Mock).mockReturnValue({
      openPulls: [],
      pullsToCombine,
    });

    (createBatchBranch as jest.Mock).mockReturnValue(true);

    await dependabotBatcher();

    expect(updateBatchPr).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      pullsToCombine,
      []
    );
  });

  it('should create batch PR if it does not exist and there are prs to combine', async () => {
    const pullsToCombine =  [ {
      branch: 'foo',
      number: 0,
    } ];

    (getPulls as jest.Mock).mockReturnValue({
      openPulls: [],
      pullsToCombine,
    });

    (createBatchBranch as jest.Mock).mockReturnValue(false);

    await dependabotBatcher();

    expect(createBatchPr).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      pullsToCombine,
    );
  });

  it('should tidy up merged pulls', async () => {
    const pullsToCombine =  [
      { branch: 'foo', number: 0 },
      { branch: 'bar', number: 1 }
    ];

    (getPulls as jest.Mock).mockReturnValue({
      openPulls: [],
      pullsToCombine,
    });

    await dependabotBatcher();

    expect(handleMergedPull).toBeCalledTimes(2);

    expect(handleMergedPull).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      'foo',
      0
    );

    expect(handleMergedPull).toBeCalledWith(
      { octokit: { mocked: true }, owner: 'Legal-and-General', repo: 'SomeRepository' },
      'bar',
      1
    );
  });
});
