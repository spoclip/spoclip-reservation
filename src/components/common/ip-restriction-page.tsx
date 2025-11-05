import { Container, Flex, Heading, Text, Button } from '@radix-ui/themes';
import { ShieldX } from 'lucide-react';

export function IpRestrictionPage() {
  return (
    <Container width="100%" maxWidth="600px" p="4">
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="4"
        minHeight="60vh"
      >
        <ShieldX size={48} />

        <Heading size="4">스포클립 전용 WiFi를 연결해주세요.</Heading>

        <Text size="3" color="gray" align="center">
          영상을 안전하게 보호하기 위해
          <br /> 허용된 네트워크에서만 접근할 수 있어요.
        </Text>

        <Button
          size="3"
          variant="soft"
          color="gray"
          // @todo. ip 검증 invalidate
          onClick={() => {}}
        >
          새로고침
        </Button>
      </Flex>
    </Container>
  );
}
