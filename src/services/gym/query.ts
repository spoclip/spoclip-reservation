import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { GetCourtRequest, GetGymRequest } from './types';
import { getCourt, getGym } from './service';
import { gymQueryKey } from './key';

export function useGetGym({ uuid }: GetGymRequest) {
  return useSuspenseQuery({
    ...getGymQuery(uuid),
  });
}

export const getGymQuery = (uuid: string) =>
  queryOptions({
    queryKey: gymQueryKey.detailGym(uuid),
    queryFn: () => getGym({ uuid }),
  });

export const getCourtQuery = (params: GetCourtRequest) =>
  queryOptions({
    queryKey: gymQueryKey.detailCourt(params.courtUuid),
    queryFn: () => getCourt(params),
  });
