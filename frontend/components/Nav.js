import { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';

import User from './User';

const Nav = () => {

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