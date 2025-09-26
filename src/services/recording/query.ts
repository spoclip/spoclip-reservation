import { queryOptions, useMutation } from '@tanstack/react-query';

import {
  cancelRecording,
  createRecording,
  getRecordingBaseInfo,
  getRecordingHistory,
  sendToMeRecording,
} from './service';
import { recordingQueryKeys } from './key';
import type {
  CancelRecordingRequest,
  GetRecordingBaseInfoRequest,
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

export function useCancelRecordingMutation() {
  return useMutation({
    mutationFn: (params: CancelRecordingRequest) => cancelRecording(params),
  });
}

export function getRecordingBaseInfoQuery(params: GetRecordingBaseInfoRequest) {
  return queryOptions({
    queryKey: recordingQueryKeys.active(params),
    queryFn: () => getRecordingBaseInfo(params),
  });
}
