import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware, Args } from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { Project } from '../entities/Project'
import { User } from '../entities/User'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { ProjectCreateInput } from './types/ProjectCreateInput'
import { needsAuth } from '../middleware/auth'
import { ProjectInput } from './types/ProjectInput'

@Resolver()
export class ProjectResolver {
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
}
