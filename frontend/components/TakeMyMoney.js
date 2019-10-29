import React, { Component } from 'react';
import StripeChekout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

import calcTotalPrice from '../lib/calcTotalPrice';

const totalItems = (cart) => {
  return  cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);
}

class TakeMyMoney extends Component {

  onToken(token) {
    console.log({token})
  }

  render() {
    return (
      <User>
        {
          ({data: { me }}) => {
            console.log({ me });
            return (
              <StripeChekout
                amount={calcTotalPrice(me.cart)}
                name="Mercadito"
                description={`Order of ${totalItems(me.cart)} items`}
                image={ me.cart[0].item && me.cart[0].item.image }
                stripeKey="pk_test_EHsVZCCA8VZjCSqTvHvi8BVs00Vi9E2HxV"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res )}
              >
                {this.props.children}
              </StripeChekout>
            );
          }
        }
      </User>
    );
  }
}

export default TakeMyMoney;