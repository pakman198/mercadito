import React, { Component } from 'react';
import { Query } from 'react-apollo';
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
  return (
    <Query query={ALL_USERS_QUERY}>
      {
        ({data, loading, error}) => {
          return (
            <div>
              <Error error={error} />
              <div>
                <h2>Manage Permissions</h2>
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
                        <User key={user.id} user={user} />
                      ))
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          );
        }
      }
    </Query>
  );
}

const User = ({ user }) => {
  return (
    <tr>
      <td>{ user.name }</td>
      <td>{ user.email }</td>
      { possiblePermissions.map((p,i) => (
        <td key={i}>
          <label htmlFor={`${user.name}-permission-${p}`}>
            <input type="checkbox"/>
          </label>
        </td>
      )) }
      <td>
        <SickButton>Update</SickButton>
      </td>
    </tr>
  )
}

export default Permissions;