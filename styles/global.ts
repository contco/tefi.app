import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle<{ theme: any }>`
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-LightItalic.woff2') format('woff2');
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-Italic.woff2') format('woff2');
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-BoldItalic.woff2') format('woff2');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-Medium.woff2') format('woff2');
  font-display: swap;
  font-weight: 500;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-MediumItalic.woff2') format('woff2');
  font-display: swap;
  font-weight: 500;
  font-style: italic;
}
@font-face {
  font-family: 'GothamPro';
  src: url('/fonts/GothamPro-Black.woff2') format('woff2');
  font-display: swap;
  font-weight: 900;
}

html,
body {
  padding: 0;
  margin: 0;
  font-family: GothamPro, sans-serif;
  background-color: ${(props) => props.theme.colors.background};
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

input,
select,
textarea,
button {
  font-family: inherit;
}

`;
export default GlobalStyle;
