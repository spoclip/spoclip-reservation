import {
  Button,
  Container,
  Flex,
  IconButton,
  Reset,
  Text,
} from '@radix-ui/themes';
import s from './header.css';
import { logo } from '../../assets';
import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Container p="3" className={s.headerContainer} maxWidth="600px">
      <header className={s.header}>
        <Flex justify="between" align="center">
          <img src={logo} alt="logo" width={120} />
          <IconButton
            color="gray"
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </IconButton>
        </Flex>
        {isMenuOpen && <Navigations />}
      </header>
    </Container>
  );
}

function Navigations() {
  const navigations = [
    {
      label: '스포클립',
      href: 'https://www.spoclip.ai',
    },
    {
      label: '서비스 소개',
      href: 'https://www.spoclip.co.kr',
    },
  ];
  return (
    <nav>
      <Flex direction="column" gap="5" m="3" mt="5">
        {navigations.map((navigation) => (
          <Button
            asChild
            key={navigation.label}
            variant="ghost"
            color="gray"
            size="4"
          >
            <a href={navigation.href}>{navigation.label}</a>
          </Button>
        ))}
      </Flex>
    </nav>
  );
}

export default Header;
