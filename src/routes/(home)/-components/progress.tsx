import { useNow } from '@/hooks/use-now';
import { getCurrentRecordingEndDate } from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { OperationDays } from '@/services/gym/enum';
import { Progress } from '@radix-ui/themes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { differenceInSeconds } from 'date-fns';

function RecordingProgress() {
  const { courtUuid, gymUuid } = HomeRoute.useSearch();

  const [{ data: court }, { data: gym }] = useSuspenseQueries({
    queries: [getCourtQuery({ courtUuid }), getGymQuery({ gymUuid })],
  });
  const { now } = useNow();

  const operationHour = gym.operatingHours.find(
    (hour) => hour.day === OperationDays[now.getDay()],
  );

  const operationStartHour = Number(operationHour?.openTime.split(':')[0]);
  const operationEndHour = Number(operationHour?.closeTime.split(':')[0]);

  const endDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operationStartHour: operationStartHour,
    operationEndHour: operationEndHour,
  });

  const TRIGGRED_AT = new Date('2025-09-25T22:00:00');

  const max = differenceInSeconds(TRIGGRED_AT, endDate);
  const value = differenceInSeconds(now, TRIGGRED_AT);

  const clampedValue = Math.max(0, Math.min(value, max));

  return <Progress value={clampedValue} max={max} size="3" />;
}

export default RecordingProgress;
