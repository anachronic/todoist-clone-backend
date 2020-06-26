import { MiddlewareFn } from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { verify } from 'jsonwebtoken'
import { User } from '../entities/User'

export const needsAuth: MiddlewareFn<ServerContext> = async ({ context }, next) => {
  const { request, logger } = context

  const authorization = request.headers.authorization
  if (!authorization) {
    throw new Error('Not authenticated')
  }

  try {
    const token = authorization.split(' ')[1]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: number }
    const user = await User.findOneOrFail({ id: userId })

    context.user = user
  } catch (err) {
    context.user = undefined
    logger.info(
      `Failed to either parse authorization token or token is not valid: ${authorization}`
    )
    throw new Error()
  }

  return next()
}
