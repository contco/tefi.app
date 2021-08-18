const space = [0, 4, 8, 16, 32, 40, 44, 50, 64, 128, 256, 512];
const breakpoints = ['22.625em', '30em', '37.500em', '48em', '56.25em', '59.125em', '61.25em', '68.75em', '75.000em'];
const fontSizes = [12, 14, 16, 20, 22, 24, 26, 32, 36, 40, 48, 60, 68, 70];
const lineHeights = [15, 17.5, 20, 25, 30, 40];

export const lightTheme = {
  space,
  breakpoints,
  fontSizes,
  lineHeights,
  colors: {
    background: '#ffffff',
    primary: '#ffffff',
    secondary: '#0221ba',
    Heading: '#000000',
    subHeading: '#cacaca',
    detailsText: '#000000',
    inputBorder: '#ececec',
    percentageIndicator: '#0221ba',
    percentageBar: '#d4d4d4',
    copyrightText: '#b4b1b1',
    modalBackground: '#ffffff',
    connectborder: 'solid 1px #0221ba',
    title: '#000',
    focused: '#f1f1f1',
    bubblePositive:'#00FF7F',
    bubbleNegative:'#D22B2B'
  },
  boxShadow: '0 1px 10px 0 rgba(225, 221, 221, 0.5)',
  opacity: {
    logo: `0.25`,
  },
};

export const darkTheme = {
  space,
  breakpoints,
  fontSizes,
  lineHeights,
  colors: {
    background: '#202235',
    primary: '#0221ba',
    secondary: '#ffffff',
    Heading: '#ffffff',
    subHeading: '#cacaca',
    detailsText: '#ffffff',
    inputBorder: '#ffffff',
    percentageIndicator: '#ffffff',
    percentageBar: '#d4d4d4',
    copyrightText: '#ffffff',
    modalBackground: '#1a1a1a',
    connectborder: '1px solid #fff',
    title: '#ffffff',
    focused: '#75768d',
    bubblePositive:'#95fa84',
    bubbleNegative:'#d24a4a'
  },
  boxShadow: '0 1px 4px 0 rgba(66, 66, 68, 0.5)',
  opacity: {
    logo: `0.40`,
  },
};
