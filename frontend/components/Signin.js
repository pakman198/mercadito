import { Query } from 'react-apollo';

import { CURRENT_USER_QUERY } from './User';
import SigninForm from './SigninForm';

const Signin = props => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {
        ({data, loading}) => {
          if(loading) return <p>Loading...</p>
          if(data && !data.me) {
            return (
              <div>
                <p>Please signin before continuing</p>
                <SigninForm />
              </div>
            );
          }

          return props.children;
        }
      }
    </Query>
  );
}

export default Signin;