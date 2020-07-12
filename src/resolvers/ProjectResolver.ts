import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { getCustomRepository } from 'typeorm'
import { ServerContext } from '../config/apollo'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { needsAuth } from '../middleware/auth'
import { ProjectRepository } from '../repositories/ProjectRepository'
import { ProjectCreateInput } from './types/ProjectCreateInput'
import { ProjectInput } from './types/ProjectInput'
import { ProjectUpdateInput } from './types/ProjectUpdateInput'

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

    return await getCustomRepository(ProjectRepository).findManyForUser(`${userId}`, includeInbox)
  }

  @Query(() => Project)
  @UseMiddleware(needsAuth)
  async inbox(@Ctx() { user }: ServerContext): Promise<Project> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated()
    }

    return await getCustomRepository(ProjectRepository).findInboxForUser(`${userId}`)
  }

  @Query(() => Project)
  @UseMiddleware(needsAuth)
  async project(@Ctx() { user }: ServerContext, @Arg('id') id: string): Promise<Project> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated()
    }

    return await getCustomRepository(ProjectRepository).findOneForUserOrFail(id, `${userId}`)
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

    return await getCustomRepository(ProjectRepository).createAndSaveForUser(
      `${userId}`,
      projectInput
    )
  }

  @Mutation(() => Project)
  @UseMiddleware(needsAuth)
  async updateProject(
    @Arg('project') input: ProjectUpdateInput,
    @Ctx() { user: ctxUser }: ServerContext
  ): Promise<Project> {
    const userId = ctxUser?.id

    if (!userId) {
      throw new NotAuthenticated('This mutation needs authentication')
    }

    return await getCustomRepository(ProjectRepository).updateProject(input, `${userId}`)
  }
}
