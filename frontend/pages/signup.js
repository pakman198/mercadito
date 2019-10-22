import styled from 'styled-components';

import Signup from '../components/Signup';
import SigninForm from '../components/SigninForm';
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = props => (
  <Columns>
    <Signup />
    <SigninForm />
    <RequestReset />
  </Columns>
);

export default SignupPage;