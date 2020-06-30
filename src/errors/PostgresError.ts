import { EntityAlreadyExistsError } from './SavingError'

export class PostgresError extends Error {
  originalError: Error
  message: string

  constructor(error: Error, message?: string) {
    super(message || error.message)
    this.originalError = error
    this.message = message || this.originalError.message
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function handleSavingError(err: any, message: string): never {
  if (err.code === '23505') {
    throw new EntityAlreadyExistsError(`${message} alredy exists.`)
  }

  throw err
}
