import { CONTEXT, Scope, Injectable, Inject, InjectionToken } from 'graphql-modules'

export const ApiKey = new InjectionToken<string>('api-key')

@Injectable({
  scope: Scope.Operation,
})
export class Utils {
  constructor(
    @Inject(CONTEXT) private context: GraphQLModules.ModuleContext,
    @Inject(ApiKey) private apiKey: any,
  ) {

  }

  foo() {
    console.log('context:', this.context)
    console.log('apiKey:', this.apiKey)
    return 'foo'
  }
}
