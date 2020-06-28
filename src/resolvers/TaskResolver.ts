import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import { User } from '../entities/User'
import { DatabaseError } from '../errors/DatabaseError'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { needsAuth } from '../middleware/auth'
import { TaskCreateInput } from './types/TaskCreateInput'
import { TaskInput } from './types/TaskInput'

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  @UseMiddleware(needsAuth)
  async tasks(@Ctx() { user }: ServerContext): Promise<Task[]> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated('This query needs authentication')
    }

    const tasks = await Task.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('project.user = :user', {
        user: userId,
      })
      .getMany()

    return tasks
  }

  @Mutation(() => Task)
  @UseMiddleware(needsAuth)
  async createTask(
    @Arg('task') { text, projectId }: TaskCreateInput,
    @Ctx() { user: ctxUser }: ServerContext
  ): Promise<Task> {
    const userId = ctxUser?.id

    if (!userId) {
      throw new NotAuthenticated('This mutation requires authentication')
    }

    const user = await User.findOneOrFail({ id: userId })
    const associatedProject = await Project.findProjectOrInbox(user, projectId)
    const task = Task.create({
      text,
      project: {
        id: associatedProject.id,
      },
    })
    await task.save()

    return task
  }

  @Mutation(() => Task)
  @UseMiddleware(needsAuth)
  async updateTask(
    @Arg('task') { id: taskId, ...fields }: TaskInput,
    @Ctx() { user }: ServerContext
  ): Promise<Task | null> {
    const userId = user?.id

    if (!userId) {
      throw new DatabaseError('Task not found for current user')
    }

    const task = await Task.createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .where('task.id = :taskId', { taskId })
      .andWhere('project.user = :userId', { userId })
      .getOne()

    if (!task) {
      throw new DatabaseError('Task not found for current user')
    }

    const modifiedTask = Task.merge(task, fields)
    await modifiedTask.save()
    return modifiedTask
  }
}
