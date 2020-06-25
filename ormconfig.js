const { SnakeNamingStrategy } = require('typeorm-naming-strategies')

const env = process.env.NODE_ENV === 'production' ? '' : 'src/'

module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [`${env}entities/**/*.{ts,js}`],
  migrations: [`${env}migrations/**/*.{ts,js}`],
  subscribers: [`${env}subscribers/**/*.{ts,js}`],
  migrationsTableName: 'typeorm_migrations',
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
}
