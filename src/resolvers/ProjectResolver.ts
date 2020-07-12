import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Root,
} from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { Project } from '../entities/Project'
import { User } from '../entities/User'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { needsAuth } from '../middleware/auth'
import { ProjectCreateInput } from './types/ProjectCreateInput'
import { ProjectInput } from './types/ProjectInput'
import { ProjectUpdateInput } from './types/ProjectUpdateInput'
import { ProjectColor } from '../entities/ProjectColor'
import { Task } from '../entities/Task'

@Resolver(Project)
export class ProjectResolver {
  @FieldResolver()
  async tasks(
    @Root() project: Project,
    @Arg('done', { nullable: true }) done?: boolean
  ): Promise<Task[]> {
    const tasks = await project.tasks

    if (typeof done !== 'undefined') {
      return tasks.filter((task: Task) => task.done === done)
    }

    return tasks
  }

  @Query(() => [Project])
  @UseMiddleware(needsAuth)
  async projects(
    @Ctx() { user }: ServerContext,
    @Args() { includeInbox = false }: ProjectInput
  ): Promise<Project[]> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated('This query needs authentication')
    }

    const qb = Project.createQueryBuilder('project').where('project.user.id = :userId', { userId })

    if (!includeInbox) {
      qb.andWhere('lower(project.name) <> :name', { name: 'inbox' })
    }

    return await qb.getMany()
  }

  @Query(() => Project)
  @UseMiddleware(needsAuth)
  async inbox(@Ctx() { user }: ServerContext): Promise<Project> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated()
    }

    const qb = Project.createQueryBuilder('project')
      .where('lower(project.name) = :name', {
        name: 'inbox',
      })
      .andWhere('project.user.id = :userId', { userId })

    let inbox = await qb.getOne()

    if (inbox) {
      return inbox
    }

    const currentUser = await User.findOne({ id: userId })

    if (!currentUser) {
      throw new NotAuthenticated()
    }

    inbox = Project.create({
      name: 'Inbox',
    })

    inbox.user = currentUser
    await inbox.save()
    return inbox
  }

  @Query(() => Project)
  @UseMiddleware(needsAuth)
  async project(@Ctx() { user }: ServerContext, @Arg('id') id: string): Promise<Project> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated()
    }

    const qb = Project.createQueryBuilder('project')
      .where('project.id = :id', { id: +id })
      .andWhere('project.user.id = :userId', { userId })

    const result = await qb.getOne()
    if (!result) {
      throw new Error('No project found')
    }

    return result
  }

  @Mutation(() => Project)
  @UseMiddleware(needsAuth)
  async createProject(
    @Arg('project') projectInput: ProjectCreateInput,
    @Ctx() { user: ctxUser }: ServerContext
  ): Promise<Project> {
    const userId = ctxUser?.id

    if (!userId) {
      throw new NotAuthenticated('This mutation needs authentication')
    }

    const user = await User.findOneOrFail(userId)
    const project = Project.create(projectInput)
    project.user = user

    await project.save()

    return project
  }

  @Mutation(() => Project)
  @UseMiddleware(needsAuth)
  async updateProject(
    @Arg('project') { id, name, colorId }: ProjectUpdateInput,
    @Ctx() { user: ctxUser }: ServerContext
  ): Promise<Project> {
    const userId = ctxUser?.id

    if (!userId) {
      throw new NotAuthenticated('This mutation needs authentication')
    }

    const qb = Project.createQueryBuilder('project')
      .where('project.id = :id', { id })
      .andWhere('project.user.id = :userId', { userId })

    const project = await qb.getOne()

    if (!project) {
      throw new Error('No project found')
    }

    if (name) {
      project.name = name
    }

    if (typeof colorId !== 'undefined') {
      const color = await ProjectColor.findOne({ id: colorId })
      if (!color) {
        throw new Error('Color not found')
      }
      project.color = color
    }
    await project.save()

    return project
  }
}
