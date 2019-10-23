import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';

import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // this property works more or less like the store. Instead of methods for setting/updating 
    // the state, we use Mutations. On the defaults we baically set the initial state 
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(obj, variables, context) {
            const { client: { cache }} = context;
            
            // read the cartOpen value from cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY 
            });

            const state = {
              data: { cartOpen: !cartOpen }
            }

            cache.writeData(state);
            
            return state;
          } 
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
