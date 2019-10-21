import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import SuccessMessage from './styles/SuccessMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {

  state = {
    email: '',
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(e, cb) {
    e.preventDefault();
    const res = await cb();
    console.log({ res });
    this.setState({ email: '' });
  }

  renderForm(mutation, { error, loading, called }) {
    return (
      <Form method="post" onSubmit={(e) => this.handleSubmit(e, mutation)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Request a password reset</h2>
          <Error error={error} />
          { !error && !loading && called && <SuccessMessage>Check your email.</SuccessMessage> }
          <label htmlFor="email">
            Email
            <input 
              type="email" 
              name="email" 
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange} />
          </label>
          <button type="submit">Request token!</button>
        </fieldset>
      </Form>
    );
  }

  render() {
    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION} 
        variables={this.state}
      >
        {
          (requestReset, payload) => this.renderForm(requestReset, payload)
        }
      </Mutation>
    );
  }
}

export default RequestReset;