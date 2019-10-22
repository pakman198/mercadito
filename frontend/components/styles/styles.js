import { createGlobalStyle } from 'styled-components';

export const theme = {
  primary: '#1abebf',
  black: '#393939',
  grey: '#3a3a3a',
  lightGrey: '#e1e1e1',
  offWhite: '#ededed',
  maxWidth: '1140px',
  boxShadow: '0 12px 24px 0 rgba(0, 0, 0, .09)'
}

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'radnika-next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'radnika-next';
  }

  a {
    text-decoration: none;
    color: ${theme.black};
  }

  button:hover {
    cursor: pointer;
  }
`;