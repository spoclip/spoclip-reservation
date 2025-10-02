import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v3';

import { HomeRoute } from '@/libs/routes';
import { recordingQueryKeys } from '@/services/recording/key';

export function useSseEvent() {
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/recordings/sse/court-events`;
    const searchParams = new URLSearchParams({ courtUuid, gymUuid });
    const url = `${baseUrl}?${searchParams}`;

    const eventSource = new EventSource(url);
    eventSource.addEventListener('message', (e) => {
      enum EVENT_NAME {
        AUTO_COMPLETED = 'recording.auto-completed',
        RECORDING_STARTED = 'recording.started',
      }

      const { event } = z
        .object({
          event: z.nativeEnum(EVENT_NAME),
          data: z.unknown(),
        })
        .parse(JSON.parse(e.data));

      switch (event) {
        case EVENT_NAME.AUTO_COMPLETED:
          queryClient.invalidateQueries({
            queryKey: recordingQueryKeys.completedList(),
          });
          break;
        case EVENT_NAME.RECORDING_STARTED:
          queryClient.invalidateQueries({
            queryKey: recordingQueryKeys.baseInfos(),
          });
          break;
      }
    });
    return () => {
      eventSource.close();
    };
  }, [courtUuid, gymUuid, queryClient]);
}
