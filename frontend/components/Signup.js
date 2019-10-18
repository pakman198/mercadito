import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id,
      email,
      name
    }
  }
`;

class Signup extends Component {

  state = {
    email: '',
    name: '',
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
      name: '',
      password: ''
    })
  }

  renderForm(mutation, error, loading) {
    return (
      <Form method="post" onSubmit={(e) => this.handleSubmit(e, mutation)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Singup for an account</h2>
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
          <label htmlFor="name">
            Name
            <input 
              type="text" 
              name="name" 
              placeholder="name"
              value={this.state.name}
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
          <button type="submit">Sign up!</button>
        </fieldset>
      </Form>
    );
  }

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {
          (signup, { error, loading}) => this.renderForm(signup, error, loading)
        }
      </Mutation>
    );
  }
}

export default Signup;