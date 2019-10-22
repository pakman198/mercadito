import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id,
      email,
      name
    }
  }
`;

class SigninForm extends Component {

  state = {
    email: '',
    password: '',
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
      email: '',
      password: ''
    })
  }

  renderForm(mutation, error, loading) {
    return (
      <Form method="post" onSubmit={(e) => this.handleSubmit(e, mutation)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Sign into your account</h2>
          <Error error={error} />
          <label htmlFor="email">
            Email
            <input 
              type="email" 
              name="email" 
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange} />
          </label>
          <label htmlFor="password">
            Password
            <input 
              type="password" 
              name="password" 
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange} />
          </label>
          <button type="submit">Sign in!</button>
        </fieldset>
      </Form>
    );
  }

  render() {
    return (
      <Mutation 
        mutation={SIGNIN_MUTATION} 
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {
          (signin, { error, loading}) => this.renderForm(signin, error, loading)
        }
      </Mutation>
    );
  }
}

export default SigninForm;