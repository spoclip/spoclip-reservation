import axios from 'axios';
import { getDefaultStore } from 'jotai';

import { authAtom } from '@/stores/auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const jotaiStore = getDefaultStore();
  const { token } = jotaiStore.get(authAtom);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
