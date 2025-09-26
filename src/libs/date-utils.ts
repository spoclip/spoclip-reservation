import { differenceInSeconds } from 'date-fns';

/**
 * 만료 시간까지의 시간을 "HH시간 mm분 ss초 뒤 만료" 형식으로 포매팅합니다.
 * @param expiresAt 만료 시간
 * @param now 현재 시간
 * @returns 포매팅된 문자열 또는 "만료됨"
 */
export function formatTimeUntilExpiration(expiresAt: Date, now: Date): string {
  const totalSeconds = differenceInSeconds(expiresAt, now);

  // 만료된 경우
  if (totalSeconds <= 0) {
    return '만료됨';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}시간 ${minutes.toString().padStart(2, '0')}분 ${seconds.toString().padStart(2, '0')}초 뒤 만료`;
}
