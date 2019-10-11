import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import Header from './Header';
import Meta from './Meta';

import { theme, GlobalStyle } from './styles/styles';

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Container = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <StyledPage>
          <Meta />
          <Header />
          <Container>
            {this.props.children}
          </Container>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;