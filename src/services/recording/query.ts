import { queryOptions, useMutation } from '@tanstack/react-query';
import { createRecording, getRecordingHistory } from './service';
import { recordingQueryKeys } from './key';
import type { GetRecordingHistoryRequest } from './types';

export function useCreateRecordingQuery() {
  return useMutation({
    mutationFn: createRecording,
  });
}

export function getRecordingHistoryQuery(params: GetRecordingHistoryRequest) {
  return queryOptions({
    queryKey: recordingQueryKeys.completed(params),
    queryFn: () => getRecordingHistory(params),
  });
}
