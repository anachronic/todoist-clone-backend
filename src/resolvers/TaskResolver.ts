import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { Task } from '../entities/Task'
import { needsAuth } from '../middleware/auth'

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  @UseMiddleware(needsAuth)
  async tasks(@Ctx() { user }: ServerContext): Promise<Task[]> {
    const userId = user?.id

    if (!userId) {
      throw new Error('No user found in context. Try again')
    }

    const tasks = await Task.createQueryBuilder('task')
      .where('task.user = :user', {
        user: userId,
      })
      .getMany()

    return tasks
  }

  @Mutation(() => Task)
  @UseMiddleware(needsAuth)
  async createTask(@Arg('text') text: string, @Ctx() { user }: ServerContext): Promise<Task> {
    const userId = user?.id

    if (!userId) {
      throw new Error("Couldn't create task")
    }

    const task = Task.create({
      text,
      user: {
        id: userId,
      },
    })
    await task.save()
    console.log(task.id)

    return task
  }
}