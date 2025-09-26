import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createRecording,
  getRecordingHistory,
  sendToMeRecording,
} from './service';
import { recordingQueryKeys } from './key';
import type {
  GetRecordingHistoryRequest,
  SendToMeRecordingRequest,
} from './types';

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

export function useSendToMeRecordingMutation() {
  return useMutation({
    mutationFn: (params: SendToMeRecordingRequest) => sendToMeRecording(params),
  });
}
