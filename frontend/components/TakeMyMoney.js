import React, { Component } from 'react';
import StripeChekout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

import calcTotalPrice from '../lib/calcTotalPrice';

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = (cart) => {
  return  cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);
}

class TakeMyMoney extends Component {
  async onToken(token, mutation) {
    NProgress.start();
    const order = await mutation({
      variables: {
        token: token.id
      }
    }).catch(err => {
      alert(err.message);
    });

    console.log({ order })
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id}
    });
  }

  render() {
    return (
      <User>
        {
          ({data: { me }}) => {
            return (
              <Mutation 
                mutation={CREATE_ORDER_MUTATION} 
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
              >
                {
                  (createOrder) => {
                    return (
                      <StripeChekout
                        amount={calcTotalPrice(me.cart)}
                        name="Mercadito"
                        description={`Order of ${totalItems(me.cart)} items`}
                        image={ me.cart[0].item && me.cart[0].item.image }
                        stripeKey="pk_test_EHsVZCCA8VZjCSqTvHvi8BVs00Vi9E2HxV"
                        currency="USD"
                        email={me.email}
                        token={res => this.onToken(res, createOrder)}
                      >
                        {this.props.children}
                      </StripeChekout>
                    )
                  }
                }
              </Mutation>
            );
          }
        }
      </User>
    );
  }
}

export default TakeMyMoney;