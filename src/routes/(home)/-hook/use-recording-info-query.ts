import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
} from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { getRecordingBaseInfoQuery } from '@/services/recording/query';
import { useManualNow } from '@/stores/now';

export function useRecordingInfoQuery() {
  const { now } = useManualNow();
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const [{ data: gym }, { data: court }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid }), getCourtQuery({ courtUuid })],
  });

  const currentRecordingStartDate = getCurrentRecordingStartDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });
  const currentRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  const { data: baseInfo } = useSuspenseQuery(
    getRecordingBaseInfoQuery({
      courtUuid,
      gymUuid,
      startTime: currentRecordingStartDate.toISOString(),
      endTime: currentRecordingEndDate.toISOString(),
      triggeredAt: now.toISOString(),
      date: now.toISOString(),
    }),
  );

  return {
    gym,
    court,
    baseInfo,
    currentRecordingStartDate,
    currentRecordingEndDate,
  };
}
