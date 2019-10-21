import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import SuccessMessage from './styles/SuccessMessage';

import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, 
  $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, 
    confirmPassword: $confirmPassword) {
      id
      email
      password
    }
  }
`;

class Reset extends Component {

  state = {
    password: '',
    confirmPassword: '',
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(e, cb) {
    e.preventDefault();
    const res = await cb();
    console.log({ res });
    this.setState({ 
      password: '',
      confirmPassword: ''
    });
  }

  renderForm(mutation, { error, loading, called }) {

    const success = (
      <SuccessMessage>
        Your password was updated successfully.
      </SuccessMessage>
    );

    return (
      <Form method="post" onSubmit={(e) => this.handleSubmit(e, mutation)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Reset your password</h2>
          <Error error={error} />
          { !error && !loading && called && success }
          <label htmlFor="password">
            Password
            <input 
              type="password" 
              name="password" 
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange} />
          </label>
          <label htmlFor="confirmPassword">
            Confirm Password
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleChange} />
          </label>
          <button type="submit">Save!</button>
        </fieldset>
      </Form>
    );
  }

  render() {
    const variables = {
      resetToken: this.props.resetToken,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    }

    return (
      <Mutation 
        mutation={RESET_MUTATION} 
        variables={variables}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {
          (resetPassword, payload) => this.renderForm(resetPassword, payload)
        }
      </Mutation>
    );
  }
}

export default Reset;