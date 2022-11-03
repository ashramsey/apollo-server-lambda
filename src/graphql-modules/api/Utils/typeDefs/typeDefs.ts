import { gql } from 'graphql-modules'

export const typeDefs = gql`
  directive @upper on FIELD_DEFINITION

  type Hello {
    value: String @upper
  }

  type Query {
    hello(name: String): Hello
  }
`
