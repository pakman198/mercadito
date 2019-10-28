import React from 'react';
import styled from 'styled-components';

import RemoveFromCart from './RemoveFromCart';

import formatMoney from '../lib/formatMoney';

const CartItemContainer = styled.li`
  padding: 1rem 0;
  border-bottom: 1px  solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 10px;
  }

  h3, p {
    margin: 0;
  }
`;

const CartItem = ({data}) => {
  const { item } = data;

  if(!item) return (
    <CartItemContainer>
      <p>This item has been removed</p>
      <RemoveFromCart id={data.id} />
    </CartItemContainer>
  );

  return (
    <CartItemContainer>
      <img src={item.image} alt={item.description} height="100" />
      <div className="cart-item-details">
        <h3>{ item.title }</h3>
        <p>
          { formatMoney(item.price * data.quantity) } { ' - ' }
          <em>
            { data.quantity } &times; { formatMoney(item.price) }
          </em>
        </p>
      </div>
      <RemoveFromCart id={data.id} />
    </CartItemContainer>
  )
}

export default CartItem;