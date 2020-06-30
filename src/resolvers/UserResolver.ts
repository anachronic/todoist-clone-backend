import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql'
import { User } from '../entities/User'
import { CreateUserInput } from './types/CreateUserInput'
import { needsAuth } from '../middleware/auth'
import { ServerContext } from '../config/apollo'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'

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
