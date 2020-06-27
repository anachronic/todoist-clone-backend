import dotenv from 'dotenv'
import express from 'express'
import 'reflect-metadata'
import { setupApollo } from './config/apollo'
import { setupDatabase } from './config/database'
import { sessionRouter } from './routers/SessionRouter'
import cookieParser from 'cookie-parser'

async function main() {
  dotenv.config({ path: '.prod.env' })
  dotenv.config({ path: '.development.env' })
  dotenv.config({ path: '.default.env' })

  const port = process.env.EXPRESS_PORT
  const app = express()

  const { setupLogging, logger } = await import('./config/logging')
  await setupLogging(app)
  await setupDatabase(logger)
  await setupApollo(app, logger)

  app.use(cookieParser())
  app.get('/', async (_req, res) => {
    res.send({
      status: 'ok',
    })
  })
  app.use('/sessions', sessionRouter)

  app.listen(port, () => logger.info(`Listening on ${port}`))
}

main()
