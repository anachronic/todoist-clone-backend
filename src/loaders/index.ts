import { createColorBatcher } from './projectColorLoader'

export interface Loaders {
  projectColorLoader: ReturnType<typeof createColorBatcher>
}
