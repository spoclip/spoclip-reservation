import type { ApiResponse } from '@/types/api';

export type CreateRecordingRequest = {
  date: string;
  startTime: string;
  phoneNumber: string;
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
  endTime: string;
};

export type GetRecordingHistoryRequest = {
  gymUuid: string;
  courtUuid: string;
};

export type GetRecordingHistoryResponse = ApiResponse<
  {
    uuid: string;
    date: string;
    startTime: string;
    endTime: string;
    recordingStatus: string;
    expiresAt: string;
    userName: string;
    triggeredAt: string;
  }[]
>;
