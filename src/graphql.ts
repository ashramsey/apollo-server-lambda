// import { Server } from './Server'
import { PubSub, Server, withFilter, DynamoDBEventStore, DynamoDBSubscriptionManager, DynamoDBConnectionManager, DynamoDBEventProcessor } from '/Users/ash/dev/aws-lambda-graphql-og/packages/aws-lambda-graphql'
import { MemoryEventProcessor } from '/Users/ash/dev/aws-lambda-graphql-og/packages/aws-lambda-graphql/dist/MemoryEventProcessor'
import {
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core'
import { ulid } from 'ulid';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// serverless offline support
const ddbClient = new DynamoDBClient({
  // use serverless-dynamodb endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
        endpoint: 'http://localhost:8000',
      }
    : {}),
});
const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient)

const eventStore = new DynamoDBEventStore({  });
const pubSub = new PubSub({ eventStore })

const subscriptionManager = new DynamoDBSubscriptionManager({  });
const connectionManager = new DynamoDBConnectionManager({

  subscriptions: subscriptionManager,
});

// Construct a schema, using GraphQL schema language
// const typeDefs = `
//   type Query {
//     hello: String
//   }
// `;
const typeDefs = /* GraphQL */ `
  enum MessageType {
    greeting
    test
  }

  type Message {
    id: ID!
    text: String!
    type: MessageType!
  }

  type Mutation {
    sendMessage(text: String!, type: MessageType = greeting): Message!
  }

  type Query {
    serverTime: Float!
  }

  type Subscription {
    messageFeed(type: MessageType): Message!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  // Query: {
  //   hello: () => 'Hello world!',
  // },
  Mutation: {
    async sendMessage(rootValue: any, { text, type }: any) {
      // assert.ok(text.length > 0 && text.length < 100);
      const payload: any = { id: ulid(), text, type };

      // await pubSub.publish('NEW_MESSAGE', payload);

      return payload;
    },
  },
  Query: {
    serverTime: () => Date.now(),
  },
  Subscription: {
    messageFeed: {
      resolve: (rootValue: any) => {
        // root value is the payload from sendMessage mutation
        return rootValue;
      },
      subscribe: withFilter(
        pubSub.subscribe('NEW_MESSAGE'),
        (rootValue: any, args: { type: null | any }) => {
          // this can be async too :)
          if (args.type == null) {
            return true;
          }

          return args.type === rootValue.type;
        },
      ),
    },
  },
};

// const server = new Server({
//   typeDefs,
//   resolvers,
//   csrfPrevention: true,
//   cache: 'bounded',
//   plugins: [
//     ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//   ],
// });

const server = new Server({
  connectionManager: {} as any,
  eventProcessor: new MemoryEventProcessor(),
  resolvers,
  subscriptionManager: {} as any,
  // use serverless-offline endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
        playground: {
          subscriptionEndpoint: 'ws://localhost:4001',
        },
      }
    : {}),
  typeDefs,
});

// const graphqlHandler: any = server.createHttpHandler();
const graphqlHandler: any = async (event: any, context: any, callback: any) => {
  // const serverHandler = server.createHttpHandler();
  const serverHandler = server.createHandler()

  return serverHandler(
    {
      ...event,
      requestContext: event.requestContext || {},
    },
    context,
    callback
  );
};
export { graphqlHandler }
