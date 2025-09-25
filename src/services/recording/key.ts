import type { GetRecordingHistoryRequest } from './types';

export const recordingQueryKeys = {
  all: ['recording'] as const,
  completed: (params: GetRecordingHistoryRequest) =>
    [
      ...recordingQueryKeys.all,
      'completed',
      params.gymUuid,
      params.courtUuid,
    ] as const,
};
