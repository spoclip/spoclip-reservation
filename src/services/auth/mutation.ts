import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { login } from './service';

import { authAtom } from '@/stores/auth';

export function useLoginMutation() {
  const setAuth = useSetAtom(authAtom);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({ token: data.token });
    },
  });
}
