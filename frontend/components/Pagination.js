import React from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

import PaginationStyles from './styles/PaginationStyles';

const Pagination = props => {

  const renderPagination = (data) => {
    const { page } = props;
    const { count } = data.itemsConnection.aggregate;
    const pages = Math.ceil(count/perPage);
    
    return (
      <PaginationStyles>
        <Head>
          <title>Mercadito! | Page { page } of { pages }</title>
        </Head>
        <Link prefetch href={{ 
          pathname: "items", 
          query: { page: page - 1 }
        }}>
          <a className="prev" aria-disabled={page <= 1}>← Prev</a>
        </Link>
        <p>Page { page } of { pages }</p>
        <p>{ count } items total</p>
        <Link prefetch href={{ 
          pathname: "items", 
          query: { page: page + 1 }
        }}>
          <a className="prev" aria-disabled={page >= pages}>Next →</a>
        </Link>
      </PaginationStyles>
    );
  }

  return (
    <Query query={PAGINATION_QUERY}>
      {
        ({ data, loading, error}) => {
          if(error) return <Error error={error} />
          if(loading) return <p>Loading...</p>
          
          return renderPagination(data);
        }
      }
    </Query>
  );
}

export default Pagination;