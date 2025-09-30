import { queryOptions, useMutation } from '@tanstack/react-query';

import {
  cancelRecording,
  createRecording,
  getRecordingBaseInfo,
  getCompletedRecording,
  sendToMeRecording,
  completeRecording,
} from './service';
import { recordingQueryKeys } from './key';
import type {
  CancelRecordingRequest,
  GetRecordingBaseInfoRequest,
  GetCompletedRecordingRequest,
  SendToMeRecordingRequest,
} from './types';

export function useCreateRecordingQuery() {
  return useMutation({
    mutationFn: createRecording,
  });
}

export function getCompletedRecordingQuery(
  params: GetCompletedRecordingRequest,
) {
  return queryOptions({
    queryKey: recordingQueryKeys.completed(params),
    queryFn: () => getCompletedRecording(params),
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
    queryKey: recordingQueryKeys.baseInfo(params),
    queryFn: () => getRecordingBaseInfo(params),
  });
}

export function useCompleteRecordingMutation() {
  return useMutation({
    mutationFn: completeRecording,
  });
}
