const { GraphQLServer } = require('graphql-yoga');
const Mutation  = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

// We declare resolvers because we don't want to expose all the queries or mutations, 
// there are some queries and mutations that can only be executed by authorized users.
// In those resolver we set those validations
 
function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, db })
  })
}

module.exports = createServer;