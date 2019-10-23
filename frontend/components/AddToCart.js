import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends Component {
  render() {
    const variables = {
      id: this.props.id
    }

    return (
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={variables}>
        {
          (addToCart) => (
            <button onClick={addToCart}>Add to cart 🛒</button>
          )
        }
      </Mutation>
    )
  }
}

export default AddToCart;