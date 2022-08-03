import { Octokit } from '@octokit/rest';
import { getPulls, handleMergedPull, mergePulls } from '../src/pulls';

export const noDependabotPrsNoCombined = [
  { head: { ref: '003' }, number: 3 },
  { head: { ref: '004' }, number: 4 },
];

export const dependabotPrsNoCombined = [
  { head: { ref: 'dependabot-000' }, number: 0 },
  { head: { ref: 'dependabot-001' }, number: 1 },
  { head: { ref: 'dependabot-002' }, number: 2 },
  { head: { ref: '003' }, number: 3 },
  { head: { ref: '004' }, number: 4 },
];

describe('getPulls', () => {
  const paginateMock = jest.fn().mockReturnValue([
    { head: { ref: 'dependabot-000' }, number: 0 },
    { head: { ref: 'dependabot-001' }, number: 1 },
    { head: { ref: 'dependabot-002' }, number: 2 },
    { head: { ref: '003' }, number: 3 },
    { head: { ref: '004' }, number: 4 },
  ]);

  const octokitMock = {
    paginate: paginateMock,
    rest: {
      pulls: {
        list: [ 'foo', 'bar' ],
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should paginate pulls list', async () => {
    const {
      openPulls,
      pullsToCombine,
    } = await getPulls(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      'main',
    );

    expect(paginateMock).toBeCalledWith(
      [ 'foo', 'bar' ],
      {
        owner: 'Legal-and-General',
        repo: 'A Repository',
        state: 'open',
        base: 'main',
        per_page: 100,
      }
    );

    expect(openPulls).toEqual(dependabotPrsNoCombined);

    expect(pullsToCombine).toEqual([
      { branch: 'dependabot-000', number: 0 },
      { branch: 'dependabot-001', number: 1 },
      { branch: 'dependabot-002', number: 2 },
    ]);
  });

  it('should only return dependabot PRs in pullsToCombine', async () => {
    paginateMock.mockResolvedValueOnce(noDependabotPrsNoCombined);

    const {
      openPulls,
      pullsToCombine,
    } = await getPulls(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      'main',
    );

    expect(openPulls).toEqual(noDependabotPrsNoCombined);

    expect(pullsToCombine).toEqual([]);
  });
});

describe('mergePulls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReposMerge = jest.fn();

  const octokitMock = {
    rest: {
      repos: {
        merge: mockReposMerge,
      },
    }
  };

  it('should attempt to merge all mergeable PRs', async () => {
    await mergePulls(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      [ { branch: 'foo', number: 0 }, { branch: 'bar', number: 1 } ],
      'batched-dependabot-updates'
    );

    expect(mockReposMerge).toBeCalledTimes(2);
  });

  it('should return list of PRs that failed to merge', async () => {
    mockReposMerge.mockImplementation(() => {
      throw new Error('Oops!')
    });

    const result = await mergePulls(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      [ { branch: 'foo', number: 0 }, { branch: 'bar', number: 1 } ],
      'batched-dependabot-updates'
    );

    expect(mockReposMerge).toBeCalledTimes(2);
    expect(result).toEqual([ { branch: 'foo', number: 0 }, { branch: 'bar', number: 1 } ]);
  });

});

describe('handleMergedPull', () => {
  const mockGitDeleteRef = jest.fn();
  const mockIssuesAddLabels = jest.fn();
  const mockPullsUpdate = jest.fn();

  const octokitMock = {
    rest: {
      git: {
        deleteRef: mockGitDeleteRef,
      },
      issues: {
        addLabels: mockIssuesAddLabels,
      },
      pulls: {
        update: mockPullsUpdate,
      }
    }
  };

  it('should tidy up a merged pull request', async () => {
    await handleMergedPull(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      'foo',
      0,
    );

    expect(mockPullsUpdate).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      status: 'closed',
      pull_number: 0,
    });

    expect(mockGitDeleteRef).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      ref: 'heads/foo',
    });

    expect(mockIssuesAddLabels).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      issue_number: 0,
      labels: [ 'dependabot-batched' ],
    });
  });
});
