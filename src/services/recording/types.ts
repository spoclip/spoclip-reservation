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
  }[]
>;

export type SendToMeRecordingRequest = {
  uuid: string;
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
  phoneNumber: string;
};

export type CancelRecordingRequest = {
  uuid: string;
};

export type HasRecordingRequest = {
  gymUuid: string;
  courtUuid: string;
  startTime: string;
  endTime: string;
};

export type HasRecordingResponse = ApiResponse<{
  uuid: string;
  date: string;
  startTime: string;
  endTime: string;
  recordingStatus: 'RECORDING' | 'COMPLETED';
  expiresAt: string;
  userName: string;
  triggeredAt: string;
} | null>;
