import 'reflect-metadata'
import { createModule } from 'graphql-modules'
import { typeDefs } from './typeDefs/typeDefs'
import { resolvers } from './resolvers/resolvers'
import { UpperCaseDirective } from './directives/directives'
import { Utils, ApiKey } from './providers/providers'

const graphqlModule = createModule({
  id: 'Utils',
  typeDefs,
  resolvers,
  providers: [
    Utils,
    {
      provide: ApiKey,
      useValue: 'my-api-key'
    }
  ],
})

const directives = {
  upper: UpperCaseDirective,
}

export {
  graphqlModule,
  directives,
}
