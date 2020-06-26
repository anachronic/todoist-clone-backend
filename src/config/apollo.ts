import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequestContext } from 'apollo-server-types'
import { Express, Request, Response } from 'express'
import { buildSchema } from 'type-graphql'
import Logger from 'bunyan'
import { User } from '../entities/User'

export interface ServerContext {
  logger: Logger
  request: Request
  response: Response
  user?: User
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
      context: ({ req, res }): ServerContext => ({
        request: req,
        logger,
        response: res,
      }),
    })
    apolloServer.applyMiddleware({ app })
  } catch (err) {
    logger.error('Failed to init apollo server')
    throw err
  }
}
