import { FieldResolver, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { getRepository } from 'typeorm'
import { ProjectColor } from '../entities/ProjectColor'
import { needsAuth } from '../middleware/auth'

const colorToHex = function (rgb: number): string {
  let hex = Number(rgb).toString(16)
  if (hex.length < 2) {
    hex = `0${hex}`
  }
  return hex
}

@Resolver(ProjectColor)
export class ProjectColorResolver {
  @Query(() => [ProjectColor])
  @UseMiddleware(needsAuth)
  async projectColors(): Promise<ProjectColor[]> {
    const qb = getRepository(ProjectColor).createQueryBuilder('color')
    return await qb.getMany()
  }

  @FieldResolver()
  hex(@Root() color: ProjectColor): string {
    const rHex = colorToHex(color.red)
    const gHex = colorToHex(color.green)
    const bHex = colorToHex(color.blue)
    return `${rHex}${gHex}${bHex}`
  }
}
