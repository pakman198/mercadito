import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';
import { userInfo } from 'os';

const RemoveButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;

  &:hover {
    color: ${props => props.theme.primary};
    cursor: pointer; 
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends Component {

  // called once the mutation finished
  // @cache: ApolloCache
  // @payload: param returned form GraphQL operation
  update(cache, payload) {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data});
  }

  render() {
    const variables = {
      id: this.props.id
    }

    // This optimistic response allows the UI to update without needing to wait for the server
    // response. We expect the response from the Mutation to be as follows and then the UI
    // gets updated immediately
    const optimisticResponse = {
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id: this.props.id
      }
    }

    return (
      <Mutation 
        mutation={REMOVE_FROM_CART_MUTATION} 
        variables={variables}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
        update={this.update}
        optimisticResponse={optimisticResponse}
      >
        {
          (removeFromCart, {loading, error}) => {
            return (
              <RemoveButton 
                title="Delete Item"
                disabled={loading }
                onClick={() => removeFromCart().catch(err => alert(err.message))}
              >
                &times;
              </RemoveButton>
            );
          }
        }
      </Mutation>
    );
  }
}

export default RemoveFromCart;