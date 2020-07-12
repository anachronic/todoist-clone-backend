import { EntityRepository, getCustomRepository, getRepository, Repository } from 'typeorm'
import { Task } from '../entities/Task'
import { User } from '../entities/User'
import { DatabaseError } from '../errors/DatabaseError'
import { TaskCreateInput } from '../resolvers/types/TaskCreateInput'
import { TaskInput } from '../resolvers/types/TaskInput'
import { TasksFilterInput } from '../resolvers/types/TasksFilterInput'
import { ProjectRepository } from './ProjectRepository'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async updateTask({ id: taskId, ...fields }: TaskInput, userId: string): Promise<Task> {
    const task = await this.createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .where('task.id = :taskId', { taskId })
      .andWhere('project.user = :userId', { userId })
      .getOne()

    if (!task) {
      throw new DatabaseError('Task not found for current user')
    }

    const modifiedTask = Task.merge(task, fields)
    await this.save(modifiedTask)
    return modifiedTask
  }

  async createAndSaveForUser(userId: string, input: TaskCreateInput): Promise<Task> {
    const user = await getRepository(User).findOneOrFail(userId)

    const project = await getCustomRepository(ProjectRepository).findProjectOrInboxForUser(
      `${user.id}`,
      input.projectId
    )

    const task = this.create({
      text: input.text,
      project: {
        id: project.id,
      },
    })
    await this.save(task)
    return task
  }

  async filterTasksForUser(userId: string, input?: TasksFilterInput): Promise<Task[]> {
    const qb = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('project.user = :userId', { userId })

    if (typeof input?.done === 'boolean') {
      qb.andWhere('task.done = :done', { done: input.done })
    }

    if (input?.projectId) {
      qb.andWhere('project.id = :projectId', { projectId: input.projectId })
    }

    if (typeof input?.forToday === 'boolean') {
      qb.andWhere('task.schedule = :date', { date: new Date() })
    }

    return await qb.getMany()
  }
}
