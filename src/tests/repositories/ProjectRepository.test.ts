import { getCustomRepository, getRepository } from 'typeorm'
import { Project } from '../../entities/Project'
import { User } from '../../entities/User'
import { ProjectRepository } from '../../repositories/ProjectRepository'
import { ProjectUpdateInput } from '../../resolvers/types/ProjectUpdateInput'
import { ProjectColor } from '../../entities/ProjectColor'

describe('The custom project repository', () => {
  describe('Updating a project', () => {
    it('Updates the project name', async () => {
      const projectRepo = getCustomRepository(ProjectRepository)
      const userRepo = getRepository(User)

      const user = await userRepo.save(
        userRepo.create({
          email: 'john@doe.com',
          name: 'john doe',
          hashedPassword: '1',
        })
      )

      const project = new Project()
      project.name = 'My awesome project'
      project.user = user
      const savedProject = await projectRepo.save(project)

      const input: ProjectUpdateInput = {
        id: `${savedProject.id}`,
        name: 'New awesome name',
      }

      await projectRepo.updateProject(input, `${user.id}`)

      const editedProject = await projectRepo
        .createQueryBuilder('project')
        .where('project.id = :projectId', { projectId: savedProject.id })
        .getOne()

      if (!editedProject) {
        fail('Project was not edited or not modified')
      }

      expect(editedProject?.name).toEqual('New awesome name')
    })

    it('Updates project color', async () => {
      const projectRepo = getCustomRepository(ProjectRepository)
      const userRepo = getRepository(User)

      const user = await userRepo.save(
        userRepo.create({
          email: 'john@doe.com',
          name: 'john doe',
          hashedPassword: '1',
        })
      )

      const project = new Project()
      project.name = 'My awesome project'
      project.user = user
      const savedProject = await projectRepo.save(project)

      const color = new ProjectColor()
      color.red = color.blue = color.green = 0
      color.hex = '000000'
      color.name = 'white'
      await getRepository(ProjectColor).save(color)

      const input: ProjectUpdateInput = {
        id: `${savedProject.id}`,
        colorId: `${color.id}`,
      }

      await projectRepo.updateProject(input, `${user.id}`)

      const editedProject = await projectRepo
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.color', 'color')
        .where('project.id = :projectId', { projectId: savedProject.id })
        .getOne()

      if (!editedProject) {
        fail('Project was not edited or not modified')
      }

      expect(editedProject?.colorId).toEqual(+color.id)
    })
  })
})
