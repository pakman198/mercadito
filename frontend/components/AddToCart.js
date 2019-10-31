import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends Component {
  
  handleClick = (e, mutation) => {
    mutation().catch(e => {
      const { message } = e.graphQLErrors[0];

      alert(message)
    })
  }
  
  render() {
    const variables = {
      id: this.props.id
    }

    return (
      <Mutation 
        mutation={ADD_TO_CART_MUTATION} 
        variables={variables}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {
          (addToCart, {loading}) => (
            <button 
              onClick={(e) => this.handleClick(e, addToCart)}
              disabled={loading}
            >Add{ loading ? 'ing' : null } to cart 🛒</button>
          )
        }
      </Mutation>
    )
  }
}

export default AddToCart;