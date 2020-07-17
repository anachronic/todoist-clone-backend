import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { getCustomRepository } from 'typeorm'
import { ServerContext } from '../config/apollo'
import { User } from '../entities/User'
import { needsAuth } from '../middleware/auth'
import { UserRepository } from '../repositories/UserRepository'
import { CreateUserInput } from './types/CreateUserInput'

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
    const repository = getCustomRepository(UserRepository)

    return await repository.createFromGraphqlInput(user)
  }
}
