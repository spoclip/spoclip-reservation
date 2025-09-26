import type {
  CancelRecordingRequest,
  CreateRecordingRequest,
  GetRecordingHistoryRequest,
  GetRecordingHistoryResponse,
  SendToMeRecordingRequest,
  GetRecordingBaseInfoRequest,
  GetRecordingBaseInfoResponse,
} from './types';

import api from '@/libs/api';

export function createRecording(data: CreateRecordingRequest) {
  return api.post('/recordings', data);
}

export async function getRecordingHistory(params: GetRecordingHistoryRequest) {
  const { data } = await api.get<GetRecordingHistoryResponse>(
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
      triggeredAt: new Date().toISOString(),
      date: new Date().toISOString(),
    },
  );
  return data?.data;
}
