import type { APIResponse } from 'spoclip-kit';

export type CreateRecordingRequest = {
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
  phoneNumber: string;

  date: string;
  startTime: string;
  endTime: string;
};

export type GetCompletedRecordingRequest = {
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
};

export type GetCompletedRecordingResponse = APIResponse<
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
  gymUuid: string;
  courtUuid: string;
};

export type GetRecordingBaseInfoRequest = {
  gymUuid: string;
  courtUuid: string;
  startTime: string;
  endTime: string;
  triggeredAt: string;
  date: string;
};

export type GetRecordingBaseInfoResponse = APIResponse<{
  isRecording: boolean;
  recording: {
    uuid: string;
    date: string;
    startTime: string;
    endTime: string;
    recordingStatus: 'RECORDING' | 'COMPLETED';
    expiresAt: string;
    userName: string;
    triggeredAt: string;
  };
} | null>;

export type CompleteRecordingRequest = {
  uuid: string;
  gymUuid: string;
  courtUuid: string;
  triggeredAt: string;
  phoneNumber: string;
};

export type CompleteRecordingResponse = APIResponse<{
  uuid: string;
  date: string;
  startTime: string;
  endTime: string;
  recordingStatus: 'RECORDING';
  expiresAt: string;
  userName: string;
  triggeredAt: string;
}>;
