import { getRepository, QueryFailedError, Repository } from 'typeorm'
import { User } from '../../entities/User'

describe('The User model', () => {
  let repo: Repository<User>

  beforeAll(() => {
    repo = getRepository(User)
  })

  it('Validates uniqueness of email', async () => {
    const userData = {
      name: 'juan',
      email: 'test@example.com',
      hashedPassword: '1',
    }

    const user = repo.create(userData)
    await repo.save(user)

    const user2 = repo.create(userData)
    try {
      await repo.save(user2)
      fail('Was able to create 2 users with the same email')
    } catch (err) {
      expect(err).toEqual(expect.any(QueryFailedError))
    }
  })

  it('Normalizes emails to lowercase on database', async () => {
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

  it('Correctly compares hashed passwords', async () => {
    const user: User = repo.create({
      name: 'john doe',
      email: 'john@doe.com',
    })
    user.hashedPassword = await User.generateHashedPassword('1')
    await repo.save(user)

    expect(await user.comparePassword('1')).toBe(true)
  })
})
