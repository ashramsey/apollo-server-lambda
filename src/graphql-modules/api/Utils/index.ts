import 'reflect-metadata'
import { createModule } from 'graphql-modules'
import { typeDefs } from './typeDefs/typeDefs'
import { resolvers } from './resolvers/resolvers'
import { Utils } from './providers/providers'
import { UpperCaseDirective } from './directives/directives'

const graphqlModule = createModule({
  id: 'Utils',
  typeDefs,
  resolvers,
  providers: [Utils],
})

const directives = {
  upper: UpperCaseDirective,
}

export {
  graphqlModule,
  directives,
}
