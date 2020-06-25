import { createConnection, Connection } from 'typeorm'
import Logger from 'bunyan'

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
