import DataLoader from 'dataloader'
import { getRepository } from 'typeorm'
import { ProjectColor } from '../entities/ProjectColor'

type ColorBatcher = (keys: ReadonlyArray<string>) => Promise<ProjectColor[]>

const batchColors: ColorBatcher = async (keys) => {
  const colors = await getRepository(ProjectColor).findByIds(keys as string[])

  const map = Object.fromEntries(colors.map((color: ProjectColor) => [`${color.id}`, color]))
  return keys.map((key: string) => map[key])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createColorBatcher = () => {
  return new DataLoader<string, ProjectColor>(batchColors)
}
