import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './ItemList';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {

  update = (cache, payload) => {
    // manually update the cache on the client to match the server.
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // filter the deleted item
    const items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // update the cache
    cache.writeQuery({
      query: ALL_ITEMS_QUERY,
      data: { items }
    })
  }

  render() {
    const variables = {
      id: this.props.id
    }

    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={variables} update={this.update}>
        {
          (deleteItem, error) => (
            <button onClick={
              () => {
               if(confirm('Are you sure you want to delete this item?')) {
                deleteItem()
               }
              }
            }>Delete item</button>
          )
        }
      </Mutation>
    )
  }
}

export default DeleteItem;