// // graphql.js

import { ApolloServer } from 'apollo-server-lambda'
import { defaultFieldResolver } from "graphql";
import {
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core'
import { gql, createModule, createApplication, Injectable } from 'graphql-modules'
import { SchemaDirectiveVisitor } from "@graphql-tools/utils"

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  directive @upper on FIELD_DEFINITION

  type Hello {
    value: String @upper
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

const moduleOne = createModule({
  id: 'foo',
  typeDefs,
  resolvers,
})

const app = createApplication({
  modules: [moduleOne]
})

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === "string") {
        return result.toUpperCase();
      }
      return result;
    };
  }
}
SchemaDirectiveVisitor.visitSchemaDirectives(app.schema, {
  upper: UpperCaseDirective,
})

const server = new ApolloServer({
  schema: app.createSchemaForApollo(),
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const graphqlHandler = server.createHandler();
export { graphqlHandler }
