import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { User } from '../entities/User'
import { CreateUserInput } from './types/CreateUserInput'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(): Promise<User | null> {
    return (await User.findOne({ id: 1 })) || null
  }

  @Mutation(() => User)
  async registerUser(@Arg('user') user: CreateUserInput): Promise<User> {
    const newUser = new User()
    newUser.email = user.email
    newUser.name = user.name
    newUser.lastName = user.lastName
    newUser.hashedPassword = await User.generateHashedPassword(user.password)

    await newUser.save()
    return newUser
  }
}
