import { APIResponse } from 'spoclip-kit';

import api from '@/libs/api';

export const login = async () => {
  const { data } =
    await api.post<APIResponse<{ token: string }>>('/api/auth/login');
  return data.data;
};
