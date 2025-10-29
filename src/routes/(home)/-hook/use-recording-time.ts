import { useSuspenseQueries } from '@tanstack/react-query';

import { useIntervalNow } from '@/hooks/use-now';
import {
  getCurrentRecordingStartDate,
  getCurrentRecordingEndDate,
} from '@/libs/recording';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { HomeRoute } from '@/libs/routes';

export default function useRecordingTimeQuery() {
  const { now } = useIntervalNow();
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

  return {
    currentRecordingStartDate,
    currentRecordingEndDate,
  };
}
