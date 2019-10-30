import Signin from '../components/Signin';
import OrderSummary from '../components/Order';

const Order = props => (
  <Signin>
    <OrderSummary id={props.query.id} />
  </Signin>
);

export default Order;