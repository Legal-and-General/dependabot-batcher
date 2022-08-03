import { Octokit } from '@octokit/rest';
import { components } from '@octokit/openapi-types';

export interface OctokitParams {
  octokit: Octokit;
  owner: string;
  repo: string;
}

export type PullRequest = components["schemas"]["pull-request-simple"];

export interface UnmergedPullRequest {
  branch: string;
  number: number;
}
