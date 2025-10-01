import { Flex, Text } from '@radix-ui/themes';
import { Callout } from '@radix-ui/themes/src/index.js';
import { Clock, MapPin, Video } from 'lucide-react';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';

export default function GymInfo() {
  return (
    <GymInfoSectionWrapper>
      <GymInfoSectionContent />
    </GymInfoSectionWrapper>
  );
}

function GymInfoSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="2">
      {children}
    </Flex>
  );
}

function GymInfoSectionContent() {
  const { gym, court } = useRecordingInfoQuery();

  return (
    <>
      <Flex gap="2" align="center">
        <MapPin size={14} />
        <Text size="2">
          {gym.krName}, {court.alias}
        </Text>
      </Flex>
      <Flex gap="2" align="center">
        <Clock size={14} />
        <Text size="2">
          영업 시간: {gym.todayOperatingTime.openTime} ~
          {gym.todayOperatingTime.closeTime}
        </Text>
      </Flex>
      <Flex gap="2" align="center">
        <Video size={14} />
        <Text size="2">녹화 단위: {court.recordingInterval}분</Text>
      </Flex>
    </>
  );
}
