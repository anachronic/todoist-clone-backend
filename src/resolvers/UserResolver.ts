import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql'
import { User } from '../entities/User'
import { CreateUserInput } from './types/CreateUserInput'
import { needsAuth } from '../middleware/auth'
import { ServerContext } from '../config/apollo'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(needsAuth)
  async me(@Ctx() { user }: ServerContext): Promise<User | null> {
    if (!user) {
      return null
    }

    return user
  }

  @Mutation(() => User)
  async registerUser(@Arg('user') user: CreateUserInput): Promise<User> {
    const newUser = new User()
    newUser.email = user.email
    newUser.name = user.name
    newUser.lastName = user.lastName
    newUser.hashedPassword = await User.generateHashedPassword(user.password)

    await newUser.save()
    newUser.email = newUser.email.toLowerCase()
    return newUser
  }
}
