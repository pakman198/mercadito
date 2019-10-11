import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID) {
    item(where: { id: $id }) {
      id,
      title,
      description,
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {}

  handleChange = (e) => {
    const { value, id: name, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, gqlMutation) => {
    e.preventDefault();
    const res = await gqlMutation({
      variables: {
        id: this.props.id,
        ...this.state 
      }
    });
    console.log({ res });
  }

  renderForm(data, updateItem, loading) {
    return (
      <Form onSubmit={(e) => this.handleSubmit(e, updateItem)}>
        <h2>Sell an Item</h2>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="title">
            Title
            <input 
              type="text"
              id="title"
              placeholder="Title"
              required 
              defaultValue={data.item.title}
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
              defaultValue={data.item.price}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea 
              id="description"
              placeholder="Enter a description"
              required 
              defaultValue={data.item.description}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Sav{ loading ? 'ing' : 'e' } changes</button>
        </fieldset>
      </Form>
    )
  }

  render() {
    const variables = {
      id: this.props.id
    }

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={variables}>
        {
          ({ data, loading }) => {
            if(loading) return <p>Loading...</p>
            if(!data.item) return <p>Nodata found for ID: { this.props.id }</p>
            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state} >
                { 
                  (updateItem, { loading, error }) => (
                    <>
                      <Error error={error} />
                      { this.renderForm(data, updateItem, loading) }
                    </>
                  )
                }
              </Mutation>
            );
          } 
        }
      </Query>
    );  
  }
}

export default UpdateItem;