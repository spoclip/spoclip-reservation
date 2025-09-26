import { Button } from '@radix-ui/themes';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { isOverHalfInterval } from '@/libs/recording';
import { useManualNow } from '@/stores/now';

function RecordingCompleteButton() {
  const { now } = useManualNow();
  const { baseInfo, court, gym } = useRecordingInfoQuery();

  if (!baseInfo?.isRecording) return null;

  const isOverHalfTime = isOverHalfInterval({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  return (
    <Button>
      {isOverHalfTime
        ? '여기까지 가져가기'
        : `${court.recordingInterval / 2}분 부터 가져갈 수 있어요`}
    </Button>
  );
}

export default RecordingCompleteButton;
