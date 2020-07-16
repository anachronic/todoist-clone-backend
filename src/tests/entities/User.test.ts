import { Connection, getRepository, QueryFailedError, Repository } from 'typeorm'
import { initialiseTestTransactions, runInTransaction } from 'typeorm-test-transactions'
import { setupTestingDatabase } from '../../config/database'
import { User } from '../../entities/User'

initialiseTestTransactions()

let connection: Connection
beforeAll(async () => {
  connection = await setupTestingDatabase()
})

afterAll(async () => {
  if (connection) {
    connection.close()
  }
})

describe('The User model', () => {
  let repo: Repository<User>
  beforeEach(() => {
    repo = getRepository(User)
  })

  it(
    'Validates uniqueness of email',
    runInTransaction(async () => {
      const userData = {
        name: 'juan',
        email: 'test@example.com',
        hashedPassword: '1',
      }

      const user = repo.create(userData)
      await user.save()

      const user2 = repo.create(userData)
      try {
        await user2.save()
        fail('Was able to create 2 users with the same email')
      } catch (err) {
        expect(err).toEqual(expect.any(QueryFailedError))
      }
    })
  )

  it(
    'Normalizes emails to lowercase on database',
    runInTransaction(async () => {
      await repo.save(
        repo.create({
          name: 'some dude',
          email: 'JOHN@DOE.COM',
          hashedPassword: '1',
        })
      )

      const theDude = await repo.findOne({ email: 'john@doe.com' })
      expect(theDude).toBeTruthy()
      expect(theDude).toEqual(
        expect.objectContaining({
          email: 'john@doe.com',
          name: 'some dude',
        })
      )
    })
  )

  it(
    'Correctly compares hashed passwords',
    runInTransaction(async () => {
      const user: User = repo.create({
        name: 'john doe',
        email: 'john@doe.com',
      })
      user.hashedPassword = await User.generateHashedPassword('1')
      await repo.save(user)

      expect(await user.comparePassword('1')).toBe(true)
    })
  )
})
