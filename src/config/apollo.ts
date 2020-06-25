import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequestContext } from 'apollo-server-types'
import { Express } from 'express'
import { buildSchema } from 'type-graphql'
import Logger from 'bunyan'

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
    })
    apolloServer.applyMiddleware({ app })
  } catch (err) {
    logger.error('Failed to init apollo server')
    throw err
  }
}
