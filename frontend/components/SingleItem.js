import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';

import Error from './ErrorMessage';

const SingleItemWrapper = styled.div`
  max-width: 1140px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadow};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
      price
    }
  }
`;

class SingleItem extends Component {

  renderItem(item) {
    // by introducing here the Head from Nextjs, we're able to update 
    // the title of the page
    return (
      <SingleItemWrapper>
        
        <Head>
          <title>Mercadito! | { item.title }</title>
        </Head>
        <img src={item.largeImage} alt={item.title} />
        <div className="details">
          <h2>Viewing { item.title }</h2>
          <p>{ item.description }</p>
        </div>
      </SingleItemWrapper>
    )
  }

  render() {
    const variables = { 
      id: this.props.id 
    }
   
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={variables}>
        {
          ({ error, loading, data }) => {
            if(error) return <Error error={error} />
            if(loading) return <p>Loading...</p>
            if(!data.item) return <p>No item found for: { this.props.id }</p>
            return this.renderItem(data.item);
          }
        }
      </Query>
    );
  }
}

export default SingleItem;