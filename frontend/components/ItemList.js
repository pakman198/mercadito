import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class ItemList extends Component {

  renderItems(items) {
    const els =  items.map(item => <Item key={item.id} item={item} /> );

    return (
      <ListWrapper>
        { els }
      </ListWrapper>
    );
  }

  render() {
    return (
      <Center>
        <h1>ITEMS!</h1>
        <Query query={ALL_ITEMS_QUERY}>
          { 
            ({ data, error, loading }) => {
              if(loading) return <p>Loading...</p>;
              if(error) return <p>Error: {error.message}</p>;

              return this.renderItems(data.items)
            }
          }
        </Query>
      </Center>
    )
  }
}

export default ItemList;