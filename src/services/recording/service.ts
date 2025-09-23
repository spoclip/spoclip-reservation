import type { CreateRecordingRequest } from './types';

import api from '@/libs/api';

function createRecording(data: CreateRecordingRequest) {
  return api.post('/api/recording', data);
}

export default createRecording;
