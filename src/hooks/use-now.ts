import { useEffect, useState } from 'react';

export function useIntervalNow(
  { interval = 1000 }: { interval?: number } = { interval: 1000 },
) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  function updateNow() {
    setNow(new Date());
  }

  return { now, updateNow };
}
