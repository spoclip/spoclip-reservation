import type { GetRecordingHistoryRequest, HasRecordingRequest } from './types';

export const recordingQueryKeys = {
  all: ['recording'] as const,
  completed: (params: GetRecordingHistoryRequest) =>
    [
      ...recordingQueryKeys.all,
      'completed',
      params.gymUuid,
      params.courtUuid,
    ] as const,
  active: (params: HasRecordingRequest) =>
    [...recordingQueryKeys.all, 'active', params] as const,
};
