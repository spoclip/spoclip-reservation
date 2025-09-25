import { queryOptions } from '@tanstack/react-query';
import type {
  GetCourtRequest,
  GetCourtResponse,
  GetGymRequest,
  GetGymResponse,
} from './types';
import { gymQueryKey } from './key';
import api from '@/libs/api';
import { parseOperationHour } from '@/libs/recording';

export const getGymQuery = ({ gymUuid }: GetGymRequest) =>
  queryOptions({
    queryKey: gymQueryKey.detailGym(gymUuid),
    queryFn: async () => {
      const { data } = await api.get<GetGymResponse>(`/gyms/${gymUuid}`);
      return data.data;
    },
    select: (data) => {
      return {
        ...data,
        todayOperatingTime: parseOperationHour(data.operatingHours),
      };
    },
  });

export const getCourtQuery = (params: GetCourtRequest) =>
  queryOptions({
    queryKey: gymQueryKey.detailCourt(params.courtUuid),
    queryFn: async () => {
      const { data } = await api.get<GetCourtResponse>(
        `/courts/detail/${params.courtUuid}`,
      );
      return data.data;
    },
  });
