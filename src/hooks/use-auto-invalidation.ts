import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { addMinutes, isAfter } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useManualNow } from '@/stores/now';
import { recordingQueryKeys } from '@/services/recording';

/**
 * 특정 조건에 따라 자동으로 쿼리를 무효화하는 훅
 * - 운영 시간 외: 운영 시작 시간이 지나면 무효화
 * - 운영 시간 내: 녹화 종료 시간이 지나면 무효화
 */
export function useAutoInvalidation() {
  const {
    currentRecordingEndDate,
    gym,
    outOfOperatingTime,
    court,
    currentRecordingStartDate,
  } = useRecordingInfoQuery();
  const queryClient = useQueryClient();
  const { updateNow } = useManualNow((state) => ({
    updateNow: state.updateNow,
  }));

  const lastInvalidationTime = useRef<Date>(new Date());

  useEffect(() => {
    function shouldInvalidateQueries(now: Date): boolean {
      if (outOfOperatingTime) {
        const lastInvalidationTimeHour =
          lastInvalidationTime.current.getHours();

        const isUpdated =
          lastInvalidationTimeHour < gym.todayOperatingTime.openHour ||
          lastInvalidationTimeHour >= gym.todayOperatingTime.closeHour;

        const nowHour = now.getHours();
        return nowHour > gym.todayOperatingTime.openHour && !isUpdated;
      }

      return isAfterRecordingEndTime(now) || isAfterHalfRecordingTime(now);
    }

    function isAfterRecordingEndTime(now: Date): boolean {
      return isAfter(now, currentRecordingEndDate);
    }

    function isAfterHalfRecordingTime(now: Date): boolean {
      const halfRecordingTime = addMinutes(
        currentRecordingStartDate,
        court.recordingInterval / 2,
      );

      const isUpdated = isAfter(
        lastInvalidationTime.current,
        halfRecordingTime,
      );

      return isAfter(now, halfRecordingTime) && !isUpdated;
    }

    function invalidateRecordingQueries(): void {
      queryClient.invalidateQueries({
        queryKey: recordingQueryKeys.all,
      });
    }

    const interval = setInterval(() => {
      const now = new Date();

      if (shouldInvalidateQueries(now)) {
        invalidateRecordingQueries();
        updateNow();
        lastInvalidationTime.current = now;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentRecordingEndDate,
    queryClient,
    updateNow,
    gym,
    outOfOperatingTime,
    court,
    currentRecordingStartDate,
  ]);
}
