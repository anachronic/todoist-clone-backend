import Logger from 'bunyan'
import { Connection, createConnection } from 'typeorm'

export async function setupDatabase(logger: Logger): Promise<Connection> {
  try {
    const connection = await createConnection()
    logger.info('Database is fine')
    return connection
  } catch (err) {
    logger.error('Database is not fine')
    throw err
  }
}
