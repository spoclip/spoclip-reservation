import type { ApiResponse } from '@/types/api';
import type { OperationDay } from './enum';

export type GetGymRequest = {
  uuid: string;
};

export type GetGymResponse = ApiResponse<{
  uuid: string;
  gymCode: string;
  krName: string;
  enName: string;
  image: string;
  contact: string;
  managerName: string;
  address: string;
  operatingHours: {
    day: OperationDay;
    openTime: string;
    closeTime: string;
  }[];
}>;

export type GetCourtRequest = {
  gymUuid: string;
  courtUuid: string;
};

export type GetCourtResponse = ApiResponse<{
  uuid: string;
  courtIndex: string;
  courtType: string;
  alias: string;
  description: string;
  recordingInterval: number;
  isRecording: boolean;
}>;
