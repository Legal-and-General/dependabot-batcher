import { getInput } from '@actions/core';
import { getInputs, getMainBodyContent } from '../src/helpers';
import { PullRequest } from '../types';
import * as helpers from '../src/helpers';

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

describe('getInputs', () => {
  it('should return default values where necessary', () => {
    (getInput as jest.Mock).mockImplementation(input => {
      switch (input) {
        case 'token':
          return 'ABC';
        default:
          return undefined;
      }
    });

    const result = getInputs();

    expect(result).toEqual({
      token: 'ABC',
      baseBranchName: 'main',
      batchBranchName: 'batched-dependabot-updates',
      batchPullTitle: 'Batched Dependabot updates',
    });
  });

  it('should return all provided values', () => {
    (getInput as jest.Mock).mockImplementation(input => {
      switch (input) {
        case 'token':
          return 'ABC';
        case 'baseBranchName':
          return 'someBaseBranch';
        case 'batchBranchName':
          return 'batched-dependabot-updates';
        case 'batchPullTitle':
          return 'Batched Dependabot updates';
        default:
          return undefined;
      }
    });

    const result = getInputs();

    expect(result).toEqual({
      token: 'ABC',
      baseBranchName: 'someBaseBranch',
      batchBranchName: 'batched-dependabot-updates',
      batchPullTitle: 'Batched Dependabot updates',
    })
  });
});

describe('getMainBodyContent', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] });
    jest.setSystemTime(new Date('2022-08-02'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return body content', () => {
    const {
      pullsListMessage,
      dateInfo,
    } = getMainBodyContent([
      { number: 0, branch: 'foo' },
      { number: 1, branch: 'bar' },
      { number: 2, branch: 'baz' },
    ]);

    expect(pullsListMessage).toBe('- #0\n- #1\n- #2\n');
    expect(dateInfo).toBe('**Tue Aug 02 2022**');
  });
});

describe('isBatchPrOpen', () => {
  it('should return true when an open pr matches the baseBranch ref', () => {
    const openPulls = [
      {head: {ref: 'foo'}, number: 0},
      {head: {ref: 'bar'}, number: 1},
    ] as Array<PullRequest>;

    const result = helpers.isBatchPrOpen(openPulls, 'foo');

    expect(result).toEqual(true);
  });


  it('should return false when no open pr matches the baseBranch ref', () => {
    const openPulls = [
      {head: {ref: 'foo'}, number: 0},
      {head: {ref: 'bar'}, number: 1},
    ] as Array<PullRequest>;

    const result = helpers.isBatchPrOpen(openPulls, 'baz');

    expect(result).toEqual(false);
  });
});
