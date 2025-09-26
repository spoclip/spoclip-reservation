import type {
  GetRecordingHistoryRequest,
  GetRecordingBaseInfoRequest,
} from './types';

export const recordingQueryKeys = {
  all: ['recording'] as const,
  completed: (params: GetRecordingHistoryRequest) =>
    [
      ...recordingQueryKeys.all,
      'completed',
      params.gymUuid,
      params.courtUuid,
    ] as const,
  active: (params: GetRecordingBaseInfoRequest) =>
    [...recordingQueryKeys.all, 'active', params] as const,
};
