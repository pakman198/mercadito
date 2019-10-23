import { Fragment } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';

import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout'

import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => {

  const cartButton = (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {
        (toggleCart) => (
          <button onClick={toggleCart}>My Cart</button>
        )
      }
    </Mutation>
  )

  const signedInItems =  (
    <Fragment>
      <Link href="/sell">
        <a>Sell</a>
      </Link>
      <Link href="/orders">
        <a>Orders</a>
      </Link>
      <Link href="/account">
        <a>Account</a>
      </Link>
      <Signout />
      { cartButton }
    </Fragment>
  );

  const signinOption = (
    <Link href="/signup">
      <a>Sign in</a>
    </Link>
  );

  return (
    <User>
      {
        ({ data }) => (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>
            { data && data.me ? signedInItems : null }
            { data && !data.me ? signinOption : null}
          </NavStyles>
        )
      }
    </User>
  );
}

export default Nav;