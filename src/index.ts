import { setFailed } from '@actions/core';
import { dependabotBatcher } from './batcher';

dependabotBatcher()
  .then(() => {})
  .catch((error: Error) => {
    console.error('⚠️ ERROR', error);
    setFailed(error.message);
  });
