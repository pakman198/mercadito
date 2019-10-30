import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

import formatMoney from '../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id){
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {

  renderItems(items) {
    return items.map(item => {
      return (
        <div key={item.id} className="order-item">
          <img src={item.image} alt={item.title}/>
          <div className="item-details">
            <h2>{ item.title }</h2>
            <p>Qty: { item.quantity }</p>
            <p>Each: { formatMoney(item.price) }</p>
            <p>Subtotal: { formatMoney(item.price * item.quantity) }</p>
            <p>Each: { item.description }</p>
          </div>
        </div>
      );
    });
  }

  renderOrder({order}) {
    return (
      <OrderStyles>
        <Head>Mercadito - Order {order.id}</Head>
        <p> 
          <span>Order ID:</span>
          <span>{ order.id }</span>
        </p>
        <p> 
          <span>Charge:</span>
          <span>{ order.charge }</span>
        </p>
        <p> 
          <span>Date:</span>
          <span>{ format(parseISO(order.createdAt), 'MMMM d, yyyy h:mm a') }</span>
        </p>
        <p> 
          <span>Order total:</span>
          <span>{ formatMoney(order.total) }</span>
        </p>
        <p> 
          <span>Total items:</span>
          <span>{ order.items.length }</span>
        </p>
        <div className="items">
          { this.renderItems(order.items) }
        </div>
      </OrderStyles>
    );
  }

  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id}}>
        {
          ({data,error,loading}) => {
            if(error) return <Error error={error} />
            if(loading) return <p>Loading...</p>

            return this.renderOrder(data)
          }
        }
      </Query>
    );
  }
}

export default Order;