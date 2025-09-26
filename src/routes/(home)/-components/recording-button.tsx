import { useNow } from '@/hooks/use-now';
import { Box, Button } from '@radix-ui/themes';
import { isOverHalfInterval } from '@/libs/recording';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { HomeRoute } from '@/libs/routes';

function RecordingButton() {
  const { now } = useNow();
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const [{ data: gym }, { data: court }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid }), getCourtQuery({ courtUuid })],
  });

  const isOverHalfTime = isOverHalfInterval({
    now: now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  return (
    <Box flexGrow="1" asChild>
      <Button size="4" disabled={isOverHalfTime}>
        녹화하기
      </Button>
    </Box>
  );
}

export default RecordingButton;
