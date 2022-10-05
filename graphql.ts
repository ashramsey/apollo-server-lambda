// // graphql.js

import { ApolloServer, gql } from 'apollo-server-lambda'
import {
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
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

// import { Handler, Context, Callback } from 'aws-lambda';
// interface HelloResponse {
//    statusCode: number;
//    body: string;
// }
// const graphqlHandler: Handler = (event: any, context: Context, callback: Callback) => {
//    const response: HelloResponse = {
//      statusCode: 200,
//      body: JSON.stringify({
//        message: Math.floor(Math.random() * 10)
//      })
//    };
//    callback(undefined, response);
// };
// export { graphqlHandler }
