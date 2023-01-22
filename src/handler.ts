import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { createApplication } from 'graphql-modules'
import { SchemaDirectiveVisitor } from "@graphql-tools/utils"
import * as utils from './graphql-modules/api/Utils'

const app = createApplication({
  modules: [
    utils.graphqlModule,
  ]
})

SchemaDirectiveVisitor.visitSchemaDirectives(
  app.schema,
  utils.directives
)

const server = new ApolloServer({
  schema: app.createSchemaForApollo(),
  context: {foo: 'bar'},
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const graphqlHandler = server.createHandler();
export { graphqlHandler }
