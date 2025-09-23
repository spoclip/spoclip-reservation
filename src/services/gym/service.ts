import api from '@/libs/api';
import type {
  GetCourtRequest,
  GetCourtResponse,
  GetGymRequest,
  GetGymResponse,
} from './types';

export async function getGym({ uuid }: GetGymRequest) {
  const { data } = await api.get<GetGymResponse>(`/gyms/${uuid}`);
  return data.data;
}

export async function getCourt({ gymUuid, courtUuid }: GetCourtRequest) {
  const { data } = await api.get<GetCourtResponse>(
    `/courts/${gymUuid}/${courtUuid}`,
  );
  return data.data;
}
