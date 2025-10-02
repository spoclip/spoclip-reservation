import type {
  GetCompletedRecordingRequest,
  GetRecordingBaseInfoRequest,
} from './types';

export const recordingQueryKeys = {
  all: ['recording'] as const,
  completedList: () => [...recordingQueryKeys.all, 'completed'] as const,
  completed: (params: GetCompletedRecordingRequest) =>
    [
      ...recordingQueryKeys.all,
      'completed',
      params.gymUuid,
      params.courtUuid,
    ] as const,
  baseInfos: () => [...recordingQueryKeys.all, 'baseInfos'] as const,
  baseInfo: (params: GetRecordingBaseInfoRequest) =>
    [...recordingQueryKeys.all, 'baseInfo', params] as const,
};
