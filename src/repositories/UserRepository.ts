import { EntityRepository, AbstractRepository } from 'typeorm'
import { User } from '../entities/User'
import { CreateUserInput } from '../resolvers/types/CreateUserInput'
import { handleSavingError } from '../errors/PostgresError'

@EntityRepository()
export class UserRepository extends AbstractRepository<User> {
  async createFromGraphqlInput(userInput: CreateUserInput): Promise<User> {
    const newUser = new User()
    newUser.email = userInput.email.toLowerCase()
    newUser.name = userInput.name
    newUser.lastName = userInput.lastName
    newUser.hashedPassword = await User.generateHashedPassword(userInput.password)

    // try {
    await newUser.save()
    // } catch (err) {
    //   handleSavingError(err, newUser.email)
    // }

    return newUser
  }
}
