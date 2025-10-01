import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { addMinutes, isAfter, isBefore } from 'date-fns';

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

        return !isUpdated;
      }

      const halfRecordingTime = addMinutes(
        currentRecordingStartDate,
        court.recordingInterval / 2,
      );

      if (isBefore(now, halfRecordingTime)) {
        const isUpdated =
          isAfter(lastInvalidationTime.current, currentRecordingStartDate) &&
          isBefore(lastInvalidationTime.current, halfRecordingTime);
        return !isUpdated;
      }

      if (isAfter(now, halfRecordingTime)) {
        const isUpdated =
          isAfter(lastInvalidationTime.current, halfRecordingTime) &&
          isBefore(lastInvalidationTime.current, currentRecordingEndDate);
        return !isUpdated;
      }

      return false;
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
