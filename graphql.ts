// // graphql.js

import { ApolloServer, gql } from 'apollo-server-lambda'
import {
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Hello {
    value: String
  }

  type Query {
    hello(name: String): Hello
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (_, args) => {
      let value;
      if (args.name) {
        value = `Hello ${args.name}, nice to meet you!`
      } else {
        value = `Hello, nice to meet you!`
      }
      return { value }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const graphqlHandler = server.createHandler();
export { graphqlHandler }
