import { Octokit } from '@octokit/rest';

import { createBatchBranch } from '../src/batch-branch';
import { PullRequest } from '../types';

describe('createBatchBranch', () => {
  const mockCreateRef = jest.fn();

  const mockGetRef = jest.fn().mockReturnValue({
    data: {
      object: { sha: 'someSHA' },
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

  it('should get SHA of baseBranch', () => {
    createBatchBranch(
      { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
      [ { head: { ref: 'batchBranch' } } as PullRequest ],
      'batchBranch',
      'main',
    );

    expect(mockGetRef).toBeCalledWith({
      owner: 'Legal-and-General',
      repo: 'A Repository',
      ref: `heads/main`,
    });
  });

  describe('creating batch branch', () => {
    it('should create batch branch if it doesnt exist', async () => {
      await createBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        [ { head: { ref: 'notBatchBranch' } } as PullRequest ],
        'batchBranch',
        'main',
      );

      expect(mockCreateRef).toBeCalled();
    });

    it('should not create batch branch if it exists', async () => {
      await createBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        [ { head: { ref: 'batchBranch' } } as PullRequest ],
        'batchBranch',
        'main',
      );

      expect(mockCreateRef).not.toBeCalled();
    });
  });

  describe('return value', () => {
    it('should handle positives', async () => {
      const batchBranchAlreadyExists = await createBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        [ { head: { ref: 'batchBranch' } } as PullRequest ],
        'batchBranch',
        'main',
      );

      expect(batchBranchAlreadyExists).toBe(true);
    });

    it('should handle negatives', async () => {
      const batchBranchAlreadyExists = await createBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        [ { head: { ref: 'notBatchBranch' } } as PullRequest ],
        'batchBranch',
        'main',
      );

      expect(batchBranchAlreadyExists).toBe(false);
    });
  });
});
