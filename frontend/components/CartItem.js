import React, { Component } from 'react';
import styled from 'styled-components';

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
    </CartItemContainer>
  )
}

export default CartItem;