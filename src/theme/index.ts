import { extendTheme } from 'native-base';

// Primary palette (azul) original
const primary = {
  50: '#EBF5FF',
  100: '#D6EAFF',
  200: '#ADD5FF',
  300: '#85C1FF',
  400: '#5CACFF',
  500: '#3398FF',
  600: '#007AFF',
  700: '#005FCC',
  800: '#004799',
  900: '#003066',
};

export const theme = extendTheme({
  colors: {
    primary,
  },
});

export default theme;
