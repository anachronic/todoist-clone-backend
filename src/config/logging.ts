import { Express } from 'express'
import morgan from 'morgan'
import bunyan, { Stream } from 'bunyan'
import path from 'path'

// Unfortunately this package doesn't have types :(
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bunyanDebugStream = require('bunyan-debug-stream')

const streams: Stream[] = []

if (process.env.NODE_ENV !== 'production') {
  streams.push({
    level: 'debug',
    type: 'raw',
    stream: bunyanDebugStream({
      basepath: path.resolve(path.join(__dirname, '..')), // this should be the root folder of your project.
      forceColor: true,
    }),
  })
} else {
  // production
  streams.push({
    level: 'info',
    path: process.env.LOG_FILE,
    name: 'fileHandler',
  })
}

export const logger: bunyan = bunyan.createLogger({
  name: 'app',
  level: 'debug',
  streams: streams,
})

export async function setupLogging(app: Express): Promise<void> {
  app.use(
    morgan('combined', {
      stream: new (class LoggerStream {
        write(message: string) {
          logger.info(message)
        }
      })(),
    })
  )
}
