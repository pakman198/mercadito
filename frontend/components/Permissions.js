import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEM_CREATE",
  "ITEM_UPDATE",
  "ITEM_DELETE",
  "PERMISSION_UPDATE",
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props  => {

  const renderTable = (data) => {
    if (!data) return null;

    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            { 
              possiblePermissions.map((permission, index) => (
                <th key={index}>{ permission }</th>
              ))
            }
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          { 
            data && data.users.map(user => (
              <UserRow key={user.id} user={user} />
            ))
          }
        </tbody>
      </Table>
    );
  } 

  return (
    <Query query={ALL_USERS_QUERY}>
      {
        ({data, loading, error}) => {
          return (
            <div>
              <Error error={error} />
              <div>
                <h2>Manage Permissions</h2>
                { renderTable(data) }
              </div>
            </div>
          );
        }
      }
    </Query>
  );
}

class UserRow extends Component {
  state = {
    permissions: this.props.user.permissions
  }

  handleCheckbox = (e) => {
    const { checked, value } = e.target;
    let updatedPermissions = [...this.state.permissions];
    if(checked) {
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== value)
    }

    this.setState({
      permissions: updatedPermissions
    });
  }

  renderError(error) {
    if(!error) return null;

    return (
      <tr>
        <td colSpan="9">
          <Error error={error}/>
        </td>
      </tr>
    )
  }

  render() {
    const { user } = this.props;
    const { permissions } = this.state;
    const variables = {
      permissions,
      userId: user.id
    }

    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={variables}>
        {
          (updatePermissions, {loading, error}) => {
            return (
              <>
                { this.renderError(error) }
                <tr>
                  <td>{ user.name }</td>
                  <td>{ user.email }</td>
                  { 
                    possiblePermissions.map((p,i) => (
                      <td key={i}>
                        <label htmlFor={`${user.name}-permission-${p}`}>
                          <input 
                            id={`${user.name}-permission-${p}`}
                            type="checkbox"
                            checked={permissions.includes(p)}
                            value={p}
                            onChange={this.handleCheckbox}
                          />
                        </label>
                      </td>
                    ))
                  }
                  <td>
                    <SickButton 
                      type="button"
                      disabled={loading} 
                      onClick={updatePermissions}>Updat{ loading ? 'ing' : 'e' }</SickButton>
                  </td>
                </tr>
              </>
            );
          }
        }
      </Mutation>
    );
  }
}

export default Permissions;