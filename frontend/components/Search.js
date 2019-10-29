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

  renderItems(getItemProps, highlightedIndex) {
    const { items } = this.state;

    if(items.length == 0) return null;

    return items.map((item, index) => {
      return (
        <DropDownItem 
          key={item.id} 
          {...getItemProps({ item })}
          highlighted={index === highlightedIndex }
        >
          <img height="50" src={item.image} alt={item.title} />
          { item.title }
        </DropDownItem>
      );
    });
  }

  displayItem(item) {
    console.log({ item })

    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      }
    })
  }

  render() {
    const { items, loading } = this.state;

    return (
      <SearchStyles>
        <Downshift 
          onChange={this.displayItem}
          itemToString={item => item === null ? '' : item.title}
        >
          {
            (payload) => {
              const { getInputProps, getItemProps, isOpen, inputValue, highlightedIndex } = payload;

              return (
                <div>
                  <ApolloConsumer>
                    { 
                      client => {
                        const inputProps = {
                          type:'search',
                          placeholder: 'Search for item',
                          id: 'search',
                          className: this.state.isLoading ? 'loading' : null,
                          onChange: (e) => {
                            e.persist();
                            this.handleChange(e, client)
                          }
                        }

                        return <input {...getInputProps(inputProps)} />
                      }  
                    }
                  </ApolloConsumer>
                  {
                    isOpen && (
                      <DropDown>
                        { this.renderItems(getItemProps, highlightedIndex, inputValue) }
                        { 
                          !items.length && !loading && (
                            <DropDownItem>
                              Nothing found for { inputValue }
                            </DropDownItem>
                          )
                        }
                      </DropDown>
                    )
                  }
                </div>
              );

            }
          }
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;
