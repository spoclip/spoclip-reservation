import type { ApiResponse } from '@/types/api';

export type CreateRecordingRequest = {
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
  phoneNumber: string;

  date: string;
  startTime: string;
  endTime: string;
};

export type GetRecordingHistoryRequest = {
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
};

export type GetRecordingHistoryResponse = ApiResponse<
  {
    uuid: string;
    date: string;
    startTime: string;
    endTime: string;
    recordingStatus: 'RECORDING' | 'COMPLETED';
    expiresAt: string;
    userName: string;
    triggeredAt: string;
  }[]
>;
