import { OperationDay } from './enum';

import type { ApiResponse } from '@/types/api';

export type GetGymRequest = {
  gymUuid: string;
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
