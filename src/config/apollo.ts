import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequestContext } from 'apollo-server-types'
import { Express, Request } from 'express'
import { buildSchema } from 'type-graphql'
import Logger from 'bunyan'

export interface ServerContext {
  logger: Logger
  request: Request
}

export async function setupApollo(app: Express, logger: Logger): Promise<void> {
  const queryLoggingPlugin = {
    requestDidStart(requestContext: GraphQLRequestContext) {
      logger.debug({ name: 'GraphQL' }, requestContext.request.query)
    },
  }

  try {
    const schema = await buildSchema({
      resolvers: [`${__dirname}/../resolvers/**/*.{ts,js}`],
    })

    const apolloServer = new ApolloServer({
      schema,
      plugins: [queryLoggingPlugin],
      context: ({ req }): ServerContext => ({ request: req, logger }),
    })
    apolloServer.applyMiddleware({ app })
  } catch (err) {
    logger.error('Failed to init apollo server')
    throw err
  }
}
