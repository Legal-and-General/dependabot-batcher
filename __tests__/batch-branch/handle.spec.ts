import { Octokit } from '@octokit/rest';

import { handleBatchBranch } from '../../src/batch-branch/handle';
import { createBatchBranch } from '../../src/batch-branch/create';

jest.mock('../../src/batch-branch/create', () => ({
  createBatchBranch: jest.fn(),
}));

describe('handleBatchBranch', () => {
  const mockCreateRef = jest.fn();
  const mockDeleteRef = jest.fn();

  const mockPaginate = jest.fn().mockReturnValue([
    { ref: 'refs/heads/batchBranch' },
    { ref: 'refs/heads/batchBranch-foo' },
    { ref: 'refs/heads/someOtherBranch' },
  ]);

  const octokitMock = {
    paginate: mockPaginate,
    rest: {
      git: {
        createRef: mockCreateRef,
        deleteRef: mockDeleteRef,
      },
    }
  };

  beforeEach(() => {
    mockCreateRef.mockClear();
    mockPaginate.mockClear();
  });

  describe('batch pr exists', () => {
    it('should not create batch branch', async () => {
      await handleBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        true,
        'batchBranch',
        'main',
      );

      expect(createBatchBranch).not.toBeCalled();
    });
  });

  describe('batch pr does not exist', () => {
    it('should delete base branch if it exists then create it', async () => {
      await handleBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        false,
        'batchBranch',
        'main',
      );

      expect(mockDeleteRef).toBeCalledWith({
        owner: 'Legal-and-General',
        repo: 'A Repository',
        ref: 'heads/batchBranch',
      });

      expect(createBatchBranch).toBeCalledWith(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        'batchBranch',
        'main',
      );
    });

    it('should create batch branch if it does not exist', async () => {
      mockPaginate.mockReturnValue([
        { ref: 'refs/heads/batchBranch-foo' },
        { ref: 'refs/heads/someOtherBranch' },
      ]);

      await handleBatchBranch(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        false,
        'batchBranch',
        'main',
      );

      expect(createBatchBranch).toBeCalledWith(
        { octokit: octokitMock as unknown as Octokit, owner: 'Legal-and-General', repo: 'A Repository' },
        'batchBranch',
        'main',
      );
    });
  });
});
