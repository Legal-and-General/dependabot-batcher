import { Octokit } from '@octokit/rest';

import { createBatchBranch } from '../../src/batch-branch/create';

describe('createBatchBranch', () => {
  const mockCreateRef = jest.fn();

  const mockGetRef = jest.fn().mockReturnValue({
    data: {
      object: {sha: 'someSHA'},
    },
  });

  const octokitMock = {
    rest: {
      git: {
        createRef: mockCreateRef,
        getRef: mockGetRef,
      }
    }
  };

  beforeEach(() => {
    mockCreateRef.mockClear();
    mockGetRef.mockClear();
  });

  it('should get SHA of baseBranch', async () => {
    await createBatchBranch(
      {octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository'},
      'batchBranch',
      'main',
    );

    expect(mockGetRef).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      ref: `heads/main`,
    });
  });

  it('should create base branch', async () => {
    await createBatchBranch(
      {octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository'},
      'batchBranch',
      'main',
    );

    expect(mockCreateRef).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      ref: `refs/heads/batchBranch`,
      sha: 'someSHA',
    });
  });
});
