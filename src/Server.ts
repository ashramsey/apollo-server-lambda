import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context as LambdaContext,
  Handler as LambdaHandler,
} from 'aws-lambda'

import { ApolloServer, CreateHandlerOptions } from 'apollo-server-lambda'

export class Server<
  TEventHandler extends LambdaHandler = any
> extends ApolloServer {
  constructor({
    ...restConfig
  }: any) {
    super({...restConfig})
  }

  /**
  * HTTP event handler is responsible for processing AWS API Gateway v1 events
  */
  public createHttpHandler(options?: CreateHandlerOptions) {
    const handler = this.createHandler();
    return handler
    return (event: APIGatewayProxyEvent, context: LambdaContext) => {
      const callback = (err: any, result: any) => {
        console.log('result', result)
        console.log('err', err)
        return result
      }
      return handler(event, context, callback)

      return async (x: any) => {
        console.log('x', x)
        const { event, context, callback } = x
        console.log('event', event)
        console.log('context', context)

        return handler(event, context, callback)
      }
    }
    return (event: APIGatewayProxyEvent, context: LambdaContext) => {
      return new Promise((resolve, reject) => {
        console.log('handler', handler)
        try {
          handler(event, context, (err, result) => {
            if (err) {
              console.log('err', err)
              reject(err);
            } else {
              console.log('result', result)
              resolve(result);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    };
  }
}

