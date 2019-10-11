import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;


class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }

  handleChange = (e) => {
    const { value, id: name, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, gqlMutation) => {
    e.preventDefault();
    const res = await gqlMutation();
    console.log({ res });
    Router.push({
      pathname: "/item",
      query: { id: res.data.createItem.id }
    })
  }

  renderForm(createItem, loading) {
    return (
      <Form onSubmit={(e) => this.handleSubmit(e, createItem)}>
        <h2>Sell an Item</h2>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="title">
            Title
            <input 
              type="text"
              id="title"
              placeholder="Title"
              required 
              value={this.state.title}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="price">
            Price
            <input 
              type="number"
              id="price"
              placeholder="Price"
              required 
              value={this.state.price}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea 
              id="description"
              placeholder="Enter a description"
              required 
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    )
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state} >
        { 
          (createItem, { loading, error }) => {
            return (
              <>
                <Error error={error} />
                { this.renderForm(createItem, loading) }
              </>
            );
          }
        }
      </Mutation>
    );  
  }
}

export default CreateItem;