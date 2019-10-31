import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem'
import TakeMyMoney from './TakeMyMoney';

import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client 
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => {

  const renderItems = (items) => {
    if(!items.length) return null;

    const list = items.map(item => <CartItem key={item.id} data={item} />);

    return (
      <ul>
        {list}
      </ul>
    );
  }

  const renderCart = (userData) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {
        (toggleCart) => (
          <Query query={LOCAL_STATE_QUERY}>
            {
              ({data}) => (
                <CartStyles open={data && data.cartOpen}>
                  <header>
                    <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                    <Supreme>{ userData.name } cart</Supreme>
                    <p>You have { userData.cart.length } item{ userData.cart.length != 1 ? 's' : null } in your cart.</p>
                  </header>
                  { renderItems(userData.cart) }
                  <footer>
                    <p>{ formatMoney(calcTotalPrice(userData.cart)) }</p>
                    {
                      userData.cart.length && (
                        <TakeMyMoney toggleCart={toggleCart}>
                          <SickButton>Checkout</SickButton>
                        </TakeMyMoney>
                      )
                    }
                  </footer>
                </CartStyles>
              )
            }
          </Query>
        )
      }
    </Mutation>
  );

  return (
    <User>
      {
        ({data}) => {
          if(!data) return null;
          
          return data.me ? renderCart(data.me) : null;
        }
      }
    </User>
  );
}

export default Cart;