import express, { Router, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { logger } from '../config/logging'
import { User } from '../entities/User'

const sessionRouter: Router = express.Router()

type Payload = Record<string, unknown>

const makeResponse = (res: Response, value: string | null) => {
  return res.send({
    accessToken: value,
  })
}

sessionRouter.post('/refresh-token', async (req, res) => {
  const refreshTokenCookie: string | undefined = req.cookies.refreshtoken

  if (!refreshTokenCookie) {
    return makeResponse(res, null)
  }

  let payload: Payload
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    payload = verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET!) as Payload
  } catch (err) {
    logger.info(err)
    return makeResponse(res, null)
  }

  const { userId } = <{ userId: string | number }>payload
  const user = await User.findOne({ id: +userId })

  if (!user) {
    return makeResponse(res, 'not sure what to do here')
  }

  return makeResponse(res, user.createAccessToken())
})

export { sessionRouter }
