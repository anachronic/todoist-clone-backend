const { createConnection, getConnectionOptions } = require('typeorm')
const { beforeEach, afterAll, beforeAll } = require('@jest/globals')
const dotenv = require('dotenv')

let connection

beforeAll(async () => {
  dotenv.config({ path: '.development.env' })
  dotenv.config({ path: '.default.env' })

  const options = await getConnectionOptions()

  const testOptions = {
    ...options,
    type: 'postgres',
    database: 'todoist_clone_test',
    dropSchema: true,
    logging: false,
    synchronize: true,
    migrationsRun: false,
    cache: false,
  }

  connection = await createConnection(testOptions)
})

beforeEach(async () => {
  await connection.synchronize(true)
})

afterAll(async () => {
  if (connection) {
    await connection.close()
  }
})
