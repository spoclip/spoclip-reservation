import type {
  CancelRecordingRequest,
  CreateRecordingRequest,
  SendToMeRecordingRequest,
  GetRecordingBaseInfoRequest,
  GetRecordingBaseInfoResponse,
  GetCompletedRecordingRequest,
  GetCompletedRecordingResponse,
} from './types';

import api from '@/libs/api';

export function createRecording(data: CreateRecordingRequest) {
  return api.post('/recordings', data);
}

export async function getCompletedRecording(
  params: GetCompletedRecordingRequest,
) {
  const { data } = await api.get<GetCompletedRecordingResponse>(
    '/recordings/completed',
    {
      params,
    },
  );
  return data.data;
}

export async function sendToMeRecording({
  uuid,
  ...params
}: SendToMeRecordingRequest) {
  const { data } = await api.post(`/recordings/${uuid}/schedule`, params);
  return data.data;
}

export function cancelRecording({ uuid, ...params }: CancelRecordingRequest) {
  return api.delete(`/recordings/${uuid}`, {
    data: {
      ...params,
      triggeredAt: new Date().toISOString(),
    },
  });
}

export async function getRecordingBaseInfo(
  params: GetRecordingBaseInfoRequest,
) {
  const { data } = await api.post<GetRecordingBaseInfoResponse>(
    `/recordings/active`,
    {
      ...params,
    },
  );
  return data?.data;
}
