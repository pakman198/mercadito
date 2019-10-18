import Link from 'next/link';
import NavStyles from './styles/NavStyles';

import User from './User';

const Nav = () => (
  <NavStyles>
    <User>
      {
        ({ data }) => {
          if(data) {
            const { me: user } = data;
            return <p>{ user.name }</p>
          }

          return null;
        }
      }
    </User>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/account">
      <a>Account</a>
    </Link>
  </NavStyles>
);

export default Nav;