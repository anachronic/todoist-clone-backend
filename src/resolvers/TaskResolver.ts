import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { getCustomRepository } from 'typeorm'
import { ServerContext } from '../config/apollo'
import { Task } from '../entities/Task'
import { DatabaseError } from '../errors/DatabaseError'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { needsAuth } from '../middleware/auth'
import { TaskRepository } from '../repositories/TaskRepository'
import { TaskCreateInput } from './types/TaskCreateInput'
import { TaskInput } from './types/TaskInput'
import { TasksFilterInput } from './types/TasksFilterInput'

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  @UseMiddleware(needsAuth)
  async tasks(
    @Ctx() { user }: ServerContext,
    @Arg('filters', { nullable: true }) input?: TasksFilterInput
  ): Promise<Task[]> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated('This query needs authentication')
    }

    return await getCustomRepository(TaskRepository).filterTasksForUser(`${userId}`, input)
  }

  @Mutation(() => Task)
  @UseMiddleware(needsAuth)
  async createTask(
    @Arg('task') input: TaskCreateInput,
    @Ctx() { user: ctxUser }: ServerContext
  ): Promise<Task> {
    const userId = ctxUser?.id

    if (!userId) {
      throw new NotAuthenticated('This mutation requires authentication')
    }

    return await getCustomRepository(TaskRepository).createAndSaveForUser(`${userId}`, input)
  }

  @Mutation(() => Task)
  @UseMiddleware(needsAuth)
  async updateTask(
    @Arg('task') input: TaskInput,
    @Ctx() { user }: ServerContext
  ): Promise<Task | null> {
    const userId = user?.id

    if (!userId) {
      throw new DatabaseError('Task not found for current user')
    }

    return await getCustomRepository(TaskRepository).updateTask(input, `${userId}`)
  }
}
