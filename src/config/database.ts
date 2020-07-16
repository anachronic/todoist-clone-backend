import Logger from 'bunyan'
import dotenv from 'dotenv'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

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

export async function setupTestingDatabase(): Promise<Connection> {
  dotenv.config({ path: '.prod.env' })
  dotenv.config({ path: '.development.env' })
  dotenv.config({ path: '.default.env' })

  const options = await getConnectionOptions()

  const testOptions: PostgresConnectionOptions = {
    ...options,
    type: 'postgres',
    database: 'todoist_clone_test',
    dropSchema: true,
    logging: false,
    synchronize: true,
    migrationsRun: false,
  }

  try {
    return await createConnection(testOptions)
  } catch (err) {
    console.error('failed to setup testing database. Exiting...')
    console.trace(err)
    process.exit(-1)
  }
}
