import { EntityRepository, getRepository, Repository } from 'typeorm'
import { Project } from '../entities/Project'
import { ProjectColor } from '../entities/ProjectColor'
import { User } from '../entities/User'
import { DatabaseError } from '../errors/DatabaseError'
import { ProjectCreateInput } from '../resolvers/types/ProjectCreateInput'
import { ProjectUpdateInput } from '../resolvers/types/ProjectUpdateInput'

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async updateProject(input: ProjectUpdateInput, userId: string): Promise<Project> {
    const project = await this.createQueryBuilder('project')
      .where('project.id = :id', { id: input.id })
      .andWhere('project.user.id = :userId', { userId })
      .getOne()

    if (!project) {
      throw new DatabaseError('No project found')
    }

    if (input.name) {
      project.name = input.name
    }

    if (typeof input.colorId !== 'undefined') {
      const color = await getRepository(ProjectColor).findOneOrFail(input.colorId)
      project.color = color
    }

    await project.save()
    return project
  }

  async findProjectOrInboxForUser(userId: string, projectId?: string): Promise<Project> {
    const qb = this.createQueryBuilder('project')

    if (projectId) {
      qb.where('project.id = :projectId', { projectId })
    } else {
      qb.where('lower(project.name) = :name', { name: 'inbox' })
    }

    let project = await qb.andWhere('project.user.id = :userId', { userId }).getOne()

    if (!project) {
      project = this.create({ name: 'Inbox', user: { id: +userId } })
      await project.save()
    }

    return project
  }

  async findOneForUserOrFail(id: string, userId: string): Promise<Project> {
    const project = await this.createQueryBuilder('project')
      .where('project.id  = :id', { id })
      .andWhere('project.user.id = :userId', { userId })
      .getOne()

    if (!project) {
      throw new DatabaseError('No such project')
    }

    return project
  }

  async findInboxForUser(userId: string): Promise<Project> {
    const qb = Project.createQueryBuilder('project')
      .where('lower(project.name) = :name', {
        name: 'inbox',
      })
      .andWhere('project.user.id = :userId', { userId })

    let inbox = await qb.getOne()

    if (inbox) {
      return inbox
    }

    const currentUser = await getRepository(User).findOneOrFail(userId)

    inbox = Project.create({
      name: 'Inbox',
    })

    inbox.user = currentUser
    await inbox.save()
    return inbox
  }

  async findManyForUser(userId: string, includeInbox = false): Promise<Project[]> {
    const qb = this.createQueryBuilder('project').where('project.user.id = :userId', { userId })

    if (!includeInbox) {
      qb.andWhere('lower(project.name) <> :name', { name: 'inbox' })
    }

    return await qb.getMany()
  }

  async createAndSaveForUser(userId: string, input: ProjectCreateInput): Promise<Project> {
    const user = await getRepository(User).findOneOrFail(userId)
    const project = Project.create(input)
    project.user = user

    await project.save()
    return project
  }
}
