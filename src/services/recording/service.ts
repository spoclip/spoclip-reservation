import type {
  CreateRecordingRequest,
  GetRecordingHistoryRequest,
} from './types';

import api from '@/libs/api';

export function createRecording(data: CreateRecordingRequest) {
  return api.post('/api/recording', data);
}

export function getRecordingHistory(params: GetRecordingHistoryRequest) {
  return api.get('/api/recordings/completed', { params });
}
