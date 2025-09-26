import { style } from '@vanilla-extract/css';

const headerContainer = style({
  position: 'fixed',
  top: 0,
  zIndex: 100,
  boxShadow: 'var(--shadow-2)',
  width: '100%',
  backgroundColor: 'var(--gray-1)',
});

const header = style({});

const s = {
  headerContainer,
  header,
};

export default s;
