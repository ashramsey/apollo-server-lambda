import { Utils } from '../providers/providers'

export const resolvers = {
  Query: {
    hello: (_, args, context) => {
      const utils = context.injector.get(Utils);

      let value;
      if (args.name) {
        value = `Hello ${args.name}, nice to meet you! ${utils.foo()}`
      } else {
        value = `Hello, nice to meet you!`
      }
      return { value }
    }
  },
}
