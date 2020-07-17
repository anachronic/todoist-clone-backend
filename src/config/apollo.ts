import { ApolloError, ApolloServer } from 'apollo-server-express'
import { GraphQLRequestContext } from 'apollo-server-types'
import Logger from 'bunyan'
import { Express, Request, Response } from 'express'
import { GraphQLError, GraphQLFormattedError, GraphQLSchema } from 'graphql'
import { ArgumentValidationError, buildSchema } from 'type-graphql'
import { User } from '../entities/User'
import { Loaders } from '../loaders'
import { createColorBatcher } from '../loaders/projectColorLoader'

export interface ServerContext {
  logger: Logger
  request: Request
  response: Response
  user?: User
  loaders: Loaders
}

export async function createSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [`${__dirname}/../resolvers/**/*.{ts,js}`],
  })
}

export const formatGraphQLError = (error: GraphQLError): GraphQLFormattedError => {
  if (error.originalError instanceof ApolloError) {
    return error
  }

  if (error.originalError instanceof ArgumentValidationError) {
    const formattedError = { ...error }

    formattedError.extensions = {
      ...error.extensions,
      code: 'GRAPHQL_VALIDATION_FAILED',
      messages: error.originalError.validationErrors.flatMap((validationError) =>
        Object.values(validationError.constraints || {})
      ),
    }

    return formattedError
  }

  error.message = 'Internal Server Error'

  return error
}

export async function setupApollo(app: Express, logger: Logger): Promise<void> {
  const queryLoggingPlugin = {
    requestDidStart(requestContext: GraphQLRequestContext) {
      logger.debug({ name: 'GraphQL' }, requestContext.request.query)
    },
  }

  try {
    const schema = await createSchema()

    const apolloServer = new ApolloServer({
      schema,
      plugins: [queryLoggingPlugin],
      formatError: formatGraphQLError,
      context: ({ req, res }): ServerContext => ({
        request: req,
        logger,
        response: res,
        loaders: {
          projectColorLoader: createColorBatcher(),
        },
      }),
    })
    apolloServer.applyMiddleware({
      app,
      cors: false,
    })
  } catch (err) {
    logger.error('Failed to init apollo server')
    throw err
  }
}
