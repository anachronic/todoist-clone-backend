import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ServerContext } from '../config/apollo'
import { Project } from '../entities/Project'
import { User } from '../entities/User'
import { NotAuthenticated } from '../errors/NotAuthenticated'
import { ProjectCreateInput } from './types/ProjectCreateInput'
import { needsAuth } from '../middleware/auth'

@Resolver()
export class ProjectResolver {
  @Query(() => [Project])
  @UseMiddleware(needsAuth)
  async projects(@Ctx() { user }: ServerContext): Promise<Project[]> {
    const userId = user?.id

    if (!userId) {
      throw new NotAuthenticated('This query needs authentication')
    }

    const projects = await Project.createQueryBuilder('project')
      .where('project.user = :userId', { userId })
      .getMany()

    return projects
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
