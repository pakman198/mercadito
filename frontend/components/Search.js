import React, { Component } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import  { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

// the statements on the or condition are given by prisma
// check on the prisma.graphql file the query params
const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($term: String!) {
    items(where: {
      OR: [
        { title_contains: $term },
        { description_contains: $term }
      ]
    }) {
      id
      image
      title
    }
  }
`;

class Search extends Component {
  state = {
    items: [],
    isLoading: false
  }

  handleChange = debounce(async (event, client) => {
    this.setState({ isLoading: true });
    
    const res = await client.query({ 
      query: SEARCH_ITEMS_QUERY,
      variables: {
        term: event.target.value
      }
    });

    this.setState({
      items: res.data.items,
      isLoading: false
    })
  }, 350);

  renderItems() {
    const { items } = this.state;

    if(items.length == 0) return null;

    return items.map(item => {
      return (
        <DropDownItem key={item.id}>
          <img height="50" src={item.image} alt={item.title} />
          { item.title }
        </DropDownItem>
      );
    });
  }

  render() {
    return (
      <SearchStyles>
        <ApolloConsumer>
          {
            (client) => <input type="search" onChange={(e) => {
              e.persist();
              this.handleChange(e, client)
            }} />
          }
        </ApolloConsumer>
        <DropDown>
          { this.renderItems() }
        </DropDown>
      </SearchStyles>
    );
  }
}

export default Search;
