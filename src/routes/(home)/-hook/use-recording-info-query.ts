import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
  isOverHalfInterval,
} from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { getRecordingBaseInfoQuery } from '@/services/recording/query';
import { useManualNow } from '@/stores/now';

export function useRecordingInfoQuery() {
  const { now } = useManualNow();
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const [gymQuery, courtQuery] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid }), getCourtQuery({ courtUuid })],
  });

  const gym = gymQuery.data;
  const court = courtQuery.data;
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

  const baseInfoQuery = useSuspenseQuery(
    getRecordingBaseInfoQuery({
      courtUuid,
      gymUuid,
      startTime: currentRecordingStartDate.toISOString(),
      endTime: currentRecordingEndDate.toISOString(),
      triggeredAt: now.toISOString(),
      date: now.toISOString(),
    }),
  );
  const baseInfo = baseInfoQuery.data;

  const outOfOperatingTime =
    now.getHours() < gym.todayOperatingTime.openHour ||
    now.getHours() >= gym.todayOperatingTime.closeHour;

  const isOverHalf = isOverHalfInterval({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  return {
    gym,
    court,
    baseInfo,
    currentRecordingStartDate,
    currentRecordingEndDate,
    outOfOperatingTime,
    isOverHalf,
    baseInfoQuery,
    gymQuery,
    courtQuery,
  };
}
