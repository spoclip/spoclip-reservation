import type {
  CreateRecordingRequest,
  GetRecordingHistoryRequest,
  GetRecordingHistoryResponse,
} from './types';

import api from '@/libs/api';

export function createRecording(data: CreateRecordingRequest) {
  return api.post('/recording', data);
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
