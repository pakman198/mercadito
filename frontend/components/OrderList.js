import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';
import { formatDistance, parseISO } from 'date-fns';

import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderGrid = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class OrderList extends Component {

  renderOrders(data) {
    if(!data) return null;

    const items = data.orders.map(order => {
      return (
        <OrderItemStyles key={order.id}>
          <Link href={{ 
            pathname: '/order',
            query: { id: order.id }
          }}>
            <a>
              <div className="order-meta">
                <p>{ order.items.reduce((a,b) => a + b.quantity, 0) } items</p>
                <p>{ order.items.length } products</p>
                <p>{ formatDistance(parseISO(order.createdAt), new Date()) }</p>
                <p>{ formatMoney(order.total) }</p>
              </div>
              <div className="images">
                {
                  order.items.map(item => {
                    return (
                      <img key={item.id} src={item.image} alt={item.title} />
                    );
                  })
                }
              </div>
            </a>
          </Link>
        </OrderItemStyles>
      )
    });

    return (
      <div>
        <h2>You have { data.orders.length } orders</h2>
        <OrderGrid>
          { items }
        </OrderGrid>
      </div>
    )

  }

  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {
          ({data, error, loading}) => {
            if(error) return <Error error={error} />
            if(loading) return <p>Loading...</p>

            return this.renderOrders(data);
          }
        }
      </Query>
    );
  }
}

export default OrderList;