import type {
  CreateRecordingRequest,
  GetRecordingHistoryRequest,
  GetRecordingHistoryResponse,
  SendToMeRecordingRequest,
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
