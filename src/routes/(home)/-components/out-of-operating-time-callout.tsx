import { Callout } from '@radix-ui/themes';
import { AlertCircle } from 'lucide-react';
import { useSuspenseQueries } from '@tanstack/react-query';

import { getGymQuery } from '@/services/gym';
import { HomeRoute } from '@/libs/routes';
import { useIntervalNow } from '@/hooks/use-now';

export default function OutOfOperatingTimeCallout() {
  const { gymUuid } = HomeRoute.useSearch();
  const [gymQuery] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid })],
  });

  const { now } = useIntervalNow();

  const gym = gymQuery.data;

  const outOfOperatingTime =
    now.getHours() < gym.todayOperatingTime.openHour ||
    now.getHours() >= gym.todayOperatingTime.closeHour;

  if (outOfOperatingTime) {
    return (
      <Callout.Root color="red">
        <Callout.Icon>
          <AlertCircle size={16} />
        </Callout.Icon>
        <Callout.Text>영업 시간 외 녹화는 불가능합니다.</Callout.Text>
      </Callout.Root>
    );
  }
  return null;
}
