// todo. 테스트 후 주석 해제
/* eslint-disable no-console */
import { useCallback, useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { addMinutes, isAfter, isBefore, set } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useManualNow } from '@/stores/now';
import { recordingQueryKeys } from '@/services/recording';
import { OperatingDays } from '@/services/gym/enum';

/**
 * 특정 조건에 따라 자동으로 쿼리를 무효화하는 훅
 * - 운영 시간 외: 운영 시작 시간이 지나면 무효화
 * - 운영 시간 내: 녹화 종료 시간이 지나면 무효화
 */
export function useAutoInvalidation() {
  const { currentRecordingEndDate, gym, court } = useRecordingInfoQuery();
  const queryClient = useQueryClient();
  const { now: manualNow, updateNow } = useManualNow((state) => ({
    now: state.now,
    updateNow: state.updateNow,
  }));

  const lastInvalidationTime = useRef<Date>(new Date());

  const getBoundaryDateList = useCallback(
    function () {
      const boundaryDateList: Date[] = [];
      const now = new Date();

      const day = now.getDay();
      const todayOperatingTime = gym.operatingHours.find(
        (hour) => hour.day === OperatingDays[day],
      );
      const [openHour, openMinute] =
        todayOperatingTime?.openTime.split(':').map(Number) ?? [];
      const [closeHour, closeMinute] =
        todayOperatingTime?.closeTime.split(':').map(Number) ?? [];
      const openDate = set(new Date(now), {
        hours: openHour,
        minutes: openMinute,
        seconds: 0,
        milliseconds: 0,
      });
      const closeDate = set(new Date(now), {
        hours: closeHour,
        minutes: closeMinute,
        seconds: 0,
        milliseconds: 0,
      });

      // get half recording time

      let nextBoundary = openDate;
      boundaryDateList.push(nextBoundary);
      do {
        nextBoundary = addMinutes(nextBoundary, court.recordingInterval / 2);
        boundaryDateList.push(nextBoundary);
      } while (isBefore(nextBoundary, closeDate));

      return boundaryDateList;
    },

    [court.recordingInterval, gym.operatingHours],
  );

  useEffect(() => {
    function shouldUpdateManualNow(now: Date): boolean {
      const boundaryDateList = getBoundaryDateList();
      const nextBoundary = boundaryDateList.find((date) =>
        isBefore(manualNow, date),
      );

      const shouldInvalidate = Boolean(
        nextBoundary &&
          isAfter(now, nextBoundary) &&
          isBefore(lastInvalidationTime.current, nextBoundary),
      );

      console.log('===============================================');
      console.log(
        '업데이트가 필요한 시점인가? ',
        nextBoundary && isAfter(now, nextBoundary),
      );
      console.log(
        '업데이트를 안했는가? ',
        nextBoundary && isBefore(lastInvalidationTime.current, nextBoundary),
      );
      console.log('nextboundary', nextBoundary);
      console.log('shouldInvalidate', shouldInvalidate);
      console.log('===============================================');
      return shouldInvalidate;
    }

    function invalidateRecordingQueries(): void {
      queryClient.invalidateQueries({
        queryKey: recordingQueryKeys.all,
      });
    }

    const interval = setInterval(() => {
      const now = new Date();

      if (shouldUpdateManualNow(now)) {
        invalidateRecordingQueries();
        updateNow();
        lastInvalidationTime.current = now;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentRecordingEndDate,
    queryClient,
    manualNow,
    updateNow,
    getBoundaryDateList,
  ]);
}
