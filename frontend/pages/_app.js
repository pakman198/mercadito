import App from 'next/app';
import { ApolloProvider } from 'react-apollo';

import withData from '../lib/withData';

import Page from '../components/Page';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps =  {}
    
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.query = ctx.query;
    
    return pageProps;
  }

  render() {
    const { Component, apollo, query } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Page>
          <Component query={query} />
        </Page>
      </ApolloProvider>
    )
  }
}

export default withData(MyApp);